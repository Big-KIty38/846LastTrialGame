"""
Последний раунд (846LastTrialGame) — Детали общежития для Blender (1 м = 1 ед. Three.js).
Самодостаточный скрипт: очищает сцену, создаёт с нуля набор деталей общежития,
раскладывает их по коллекциям, настраивает предпросмотр Solid (однотонный, без цвета)
и при необходимости экспортирует каждую деталь в .glb.

Запуск в Blender:
  Scripting -> Open -> dorm_props.py -> Run Script
"""

import math
import os
import bpy
import bmesh

# Установите True, чтобы автоматически экспортировать каждую коллекцию в ../models/*.glb
EXPORT_GLB = False


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def get_or_create_collection(name, parent=None):
    if name in bpy.data.collections:
        return bpy.data.collections[name]
    col = bpy.data.collections.new(name)
    if parent is None:
        bpy.context.scene.collection.children.link(col)
    else:
        parent.children.link(col)
    return col


def link_to_collection(obj, col):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    col.objects.link(obj)


def make_material(name, base_color, roughness=0.5, metallic=0.0, alpha=1.0, emission=None, emission_strength=0.0):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
        if "Alpha" in bsdf.inputs:
            bsdf.inputs["Alpha"].default_value = alpha
        if emission and "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
            bsdf.inputs["Emission Strength"].default_value = emission_strength
        elif emission and "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = (*emission, 1.0)
            if "Emission Strength" in bsdf.inputs:
                bsdf.inputs["Emission Strength"].default_value = emission_strength
    if alpha < 1.0:
        mat.blend_method = "BLEND"
    return mat


def add_box(name, loc, size, col, mat, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0.0:
        mod = obj.modifiers.new(name="Bevel", type="BEVEL")
        mod.width = bevel
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier=mod.name)
    obj.data.materials.append(mat)
    link_to_collection(obj, col)
    return obj


def add_cylinder(name, loc, radius, depth, col, mat, rot=(0, 0, 0), vertices=20):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    link_to_collection(obj, col)
    return obj


def add_uv_sphere(name, loc, radius, scale, col, mat, segments=24, rings=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=radius, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    link_to_collection(obj, col)
    return obj


def build_piggy_bank(offset_x=0.0):
    """Гигантская прозрачная копилка-свинья (габариты как в buildPiggyBank)."""
    col = get_or_create_collection("Dorm_PiggyBank")
    glass_mat = make_material("PiggyGlass", (1.0, 0.90, 0.58), roughness=0.12, metallic=0.15, alpha=0.38)
    gold_mat = make_material("PiggyGold", (0.91, 0.72, 0.29), roughness=0.28, metallic=0.75)
    cable_mat = make_material("PiggyCable", (0.55, 0.63, 0.68), roughness=0.4, metallic=0.8)

    # Корпус (в Blender: Y — глубина, Z — высота)
    add_uv_sphere("Piggy_Body", (offset_x, 0.0, 1.85), 1.85, (1.05, 1.35, 0.88), col, glass_mat, 28, 20)
    # Пятачок
    add_cylinder("Piggy_Snout", (offset_x, -2.48, 1.70), 0.44, 0.30, col, gold_mat, rot=(math.pi / 2, 0, 0), vertices=24)
    # Ноздри
    for sx in (-0.14, 0.14):
        add_cylinder(f"Piggy_Nostril_{sx:+.2f}", (offset_x + sx, -2.63, 1.72), 0.07, 0.06, col, cable_mat, rot=(math.pi / 2, 0, 0), vertices=12)
    # Уши
    for sx in (-0.42, 0.42):
        add_box(f"Piggy_Ear_{sx:+.2f}", (offset_x + sx, -1.52, 2.98), (0.30, 0.18, 0.48), col, gold_mat, rot=(0.2, sx * 0.3, 0), bevel=0.03)
    # Ножки и тросы подвеса
    for dx in (-0.80, 0.80):
        for dy in (-0.90, 0.90):
            add_cylinder(f"Piggy_Leg_{dx:+.1f}_{dy:+.1f}", (offset_x + dx, dy, 0.65), 0.19, 0.42, col, gold_mat, vertices=14)
            add_cylinder(f"Piggy_Cable_{dx:+.1f}_{dy:+.1f}", (offset_x + dx, dy, 3.35), 0.035, 1.90, col, cable_mat, vertices=10)
    return col


def build_bunk_bed(offset_x=6.0):
    """Секция ярусной койки (2.35 x 3.45 м, 2 яруса — как в buildBunkStack)."""
    col = get_or_create_collection("Dorm_BunkBed")
    frame_mat = make_material("BunkFrame", (0.09, 0.12, 0.14), roughness=0.45, metallic=0.65)
    mattress_mat = make_material("BunkMattress", (0.88, 0.90, 0.89), roughness=0.85)
    pillow_mat = make_material("BunkPillow", (0.93, 0.92, 0.87), roughness=0.88)
    blanket_mat = make_material("BunkBlanket", (0.78, 0.80, 0.72), roughness=0.90)

    tiers = 2
    total_h = tiers * 1.28 + 0.55

    # Угловые стойки
    for dx in (-1.14, 1.14):
        for dy in (-1.68, 1.68):
            add_box(f"Bunk_Post_{dx:+.2f}_{dy:+.2f}", (offset_x + dx, dy, total_h / 2), (0.08, 0.08, total_h), col, frame_mat, bevel=0.008)

    # Ярусы
    for t in range(tiers):
        h = t * 1.28 + 0.48
        add_box(f"Bunk_Deck_{t}", (offset_x, 0.0, h), (2.35, 3.45, 0.10), col, frame_mat, bevel=0.01)
        add_box(f"Bunk_Mattress_{t}", (offset_x, 0.0, h + 0.13), (2.16, 3.26, 0.16), col, mattress_mat, bevel=0.035)
        add_box(f"Bunk_Pillow_{t}", (offset_x, -1.18, h + 0.25), (1.38, 0.52, 0.12), col, pillow_mat, bevel=0.04)
        add_box(f"Bunk_Blanket_{t}", (offset_x, 0.35, h + 0.23), (1.92, 1.88, 0.09), col, blanket_mat, bevel=0.03)
        # Боковые бортики безопасности
        for sx in (-1.12, 1.12):
            add_box(f"Bunk_Rail_{t}_{sx:+.2f}", (offset_x + sx, 0.0, h + 0.36), (0.045, 2.35, 0.05), col, frame_mat)
            for ry in (-0.85, 0.0, 0.85):
                add_box(f"Bunk_RailPost_{t}_{sx:+.2f}_{ry:+.2f}", (offset_x + sx, ry, h + 0.20), (0.04, 0.04, 0.32), col, frame_mat)

    # Перекладины лестницы в торцах
    for r in range(tiers * 3):
        rz = 0.32 + r * 0.42
        if rz < total_h - 0.10:
            for sy in (-1.68, 1.68):
                add_box(f"Bunk_Rung_{r}_{sy:+.2f}", (offset_x, sy, rz), (0.95, 0.045, 0.045), col, frame_mat)
    return col


def build_restroom_sink(offset_x=11.0):
    """Умывальник со смесителем и зеркалом (для мужского и женского туалетов)."""
    col = get_or_create_collection("Dorm_RestroomSink")
    ceramic_mat = make_material("CeramicWhite", (0.95, 0.96, 0.96), roughness=0.22, metallic=0.05)
    chrome_mat = make_material("ChromeMetal", (0.80, 0.84, 0.86), roughness=0.18, metallic=0.92)
    mirror_mat = make_material("MirrorGlass", (0.72, 0.88, 0.94), roughness=0.05, metallic=0.95)

    # Пьедестал и раковина
    add_cylinder("Sink_Pedestal", (offset_x, 0.0, 0.44), 0.13, 0.88, col, ceramic_mat, vertices=18)
    add_box("Sink_Basin", (offset_x, 0.0, 0.94), (0.96, 0.68, 0.18), col, ceramic_mat, bevel=0.04)
    # Смеситель
    add_cylinder("Sink_FaucetBase", (offset_x, -0.24, 1.11), 0.03, 0.18, col, chrome_mat, vertices=14)
    add_box("Sink_FaucetSpout", (offset_x, -0.15, 1.19), (0.04, 0.20, 0.035), col, chrome_mat, bevel=0.008)
    # Зеркало над раковиной
    add_box("Sink_MirrorFrame", (offset_x, -0.34, 1.85), (1.10, 0.05, 1.15), col, chrome_mat, bevel=0.01)
    add_box("Sink_MirrorGlass", (offset_x, -0.31, 1.85), (1.02, 0.02, 1.07), col, mirror_mat)
    return col


def build_restroom_toilet(offset_x=13.5):
    """Унитаз с бачком и сиденьем (для кабинок туалета)."""
    col = get_or_create_collection("Dorm_RestroomToilet")
    ceramic_mat = make_material("CeramicWhite", (0.95, 0.96, 0.96), roughness=0.22, metallic=0.05)
    chrome_mat = make_material("ChromeMetal", (0.80, 0.84, 0.86), roughness=0.18, metallic=0.92)

    add_cylinder("Toilet_Base", (offset_x, 0.05, 0.20), 0.19, 0.40, col, ceramic_mat, vertices=18)
    add_uv_sphere("Toilet_Bowl", (offset_x, 0.10, 0.38), 0.24, (0.95, 1.25, 0.65), col, ceramic_mat, 20, 14)
    add_box("Toilet_Seat", (offset_x, 0.10, 0.47), (0.42, 0.50, 0.045), col, ceramic_mat, bevel=0.018)
    add_box("Toilet_Tank", (offset_x, -0.22, 0.72), (0.44, 0.20, 0.44), col, ceramic_mat, bevel=0.025)
    add_cylinder("Toilet_FlushBtn", (offset_x, -0.22, 0.95), 0.035, 0.03, col, chrome_mat, vertices=14)
    return col


def build_restroom_vent(offset_x=16.0):
    """Вентиляционная шахта с жалюзийной решёткой (для разведки следующей игры)."""
    col = get_or_create_collection("Dorm_RestroomVent")
    frame_mat = make_material("VentFrame", (0.22, 0.29, 0.32), roughness=0.55, metallic=0.45)
    slat_mat = make_material("VentSlat", (0.55, 0.63, 0.66), roughness=0.40, metallic=0.60)

    add_box("Vent_Frame", (offset_x, 0.0, 1.0), (1.60, 0.14, 1.05), col, frame_mat, bevel=0.015)
    for i in range(5):
        add_box(f"Vent_Slat_{i}", (offset_x, 0.06, 0.64 + i * 0.18), (1.44, 0.10, 0.04), col, slat_mat, rot=(0.35, 0, 0))
    return col


def build_wall_camera(offset_x=18.5):
    """Настенная камера/динамик наблюдения в общежитии."""
    col = get_or_create_collection("Dorm_WallCamera")
    dark_mat = make_material("CamDark", (0.09, 0.12, 0.14), roughness=0.45, metallic=0.55)
    lens_mat = make_material("CamLens", (0.04, 0.06, 0.09), roughness=0.08, metallic=0.9)
    led_mat = make_material("CamLed", (0.95, 0.12, 0.15), roughness=0.2, emission=(1.0, 0.1, 0.1), emission_strength=4.0)

    add_box("Cam_Mount", (offset_x, -0.18, 1.0), (0.16, 0.05, 0.18), col, dark_mat, bevel=0.01)
    add_cylinder("Cam_Arm", (offset_x, -0.08, 1.0), 0.025, 0.18, col, dark_mat, rot=(math.pi / 2, 0, 0), vertices=12)
    add_box("Cam_Body", (offset_x, 0.10, 0.96), (0.20, 0.34, 0.18), col, dark_mat, rot=(-0.22, 0, 0), bevel=0.015)
    add_cylinder("Cam_Lens", (offset_x, 0.28, 0.92), 0.055, 0.06, col, lens_mat, rot=(math.pi / 2 - 0.22, 0, 0), vertices=18)
    add_uv_sphere("Cam_RedLED", (offset_x + 0.06, 0.27, 0.99), 0.014, (1, 1, 1), col, led_mat, 10, 8)
    return col


def set_solid_monochrome_viewport():
    """Устанавливает предпросмотр без цвета: режим Solid с однотонным отображением объектов."""
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "VIEW_3D":
                for space in area.spaces:
                    if space.type == "VIEW_3D":
                        space.shading.type = "SOLID"
                        space.shading.color_type = "SINGLE"
                        space.shading.light = "STUDIO"


def export_collections_to_glb(collections):
    """Экспортирует каждую коллекцию в отдельный .glb в папку ../models/."""
    script_dir = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.getcwd()
    out_dir = os.path.normpath(os.path.join(script_dir, "..", "models"))
    os.makedirs(out_dir, exist_ok=True)

    for col in collections:
        bpy.ops.object.select_all(action="DESELECT")
        for obj in col.objects:
            obj.select_set(True)
        out_path = os.path.join(out_dir, f"{col.name.lower()}.glb")
        bpy.ops.export_scene.gltf(
            filepath=out_path,
            export_format="GLB",
            use_selection=True,
            export_apply=True,
        )
        print(f"Exported: {out_path}")


def main():
    clear_scene()
    cols = [
        build_piggy_bank(offset_x=0.0),
        build_bunk_bed(offset_x=6.0),
        build_restroom_sink(offset_x=11.0),
        build_restroom_toilet(offset_x=13.5),
        build_restroom_vent(offset_x=16.0),
        build_wall_camera(offset_x=18.5),
    ]
    set_solid_monochrome_viewport()
    if EXPORT_GLB:
        export_collections_to_glb(cols)


if __name__ == "__main__":
    main()

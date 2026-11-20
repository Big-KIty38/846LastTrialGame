"""Embed local assets into one offline HTML. Python 3 standard library."""
from pathlib import Path
root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'style.css').read_text(encoding='utf-8')
engine = (root / 'vendor/three.min.js').read_text(encoding='utf-8')
game = (root / 'game.js').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n'+css+'\n</style>')
html = html.replace('<script src="vendor/three.min.js"></script>', '<script>\n'+engine.replace('</script', '<\\/script')+'\n</script>')
html = html.replace('<script src="game.js"></script>', '<script>\n'+game.replace('</script', '<\\/script')+'\n</script>')
license_text = (root / 'vendor/THREE-LICENSE.txt').read_text(encoding='utf-8')
html = '<!-- Third-party Three.js license:\n' + license_text + '\n-->\n' + html
(root / 'ИГРАТЬ.html').write_text(html, encoding='utf-8')
print('Built ИГРАТЬ.html')

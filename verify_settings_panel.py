import pathlib
files=['app/templates/user-panel.html','app/static/css/user-panel-style.css','app/static/js/user-panel-script.js']
for f in files:
    text = pathlib.Path(f).read_text(encoding='utf-8')
    print(f, '->', 'settings-panel' in text, 'toggle-settings-panel' in text)

import os

# Список файлов для очистки
files_to_fix = [
    'index.html',
    'css/main.css',
    'css/components.css',
    'css/sections.css',
    'css/responsive.css',
    'js/main.js'
]

# Замены для всех файлов
replacements = {
    '—': '-', '–': '-', '―': '-',
    '"': '"', '"': '"', '"': '"', '"': '"',
    '«': '"', '»': '"',
    ''': "'", ''': "'", ''': "'", ''': "'",
    '…': '...',
    '→': '->',
    '₽': 'rub.',
    ' ': ' ', ' ': ' ', ' ': ' ',
    '': '', '': '', '': '',
}

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Обработан: {filepath}")
    else:
        print(f"✗ Не найден: {filepath}")

print("\nГотово! Перезапустите сервер и очистите кэш браузера (Ctrl+Shift+R)")
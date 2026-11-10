import os
import re

# Brand Guideline Definitions
BRAND_GUIDELINE = {
    "brand_name": "Classical Decor ID",
    "legal_names": ["Classical Decor ID", "CLASSICAL DECOR I D", "DST Deco"],
    "tagline": "DESIGN • DECOR • PERFECT",
    "primary_color": "#141414",
    "secondary_color": "#FAF6EE",
    "accent_gold": "#E5A924",
    "accent_gold_hover": "#C48B12",
    "accent_bronze": "#B38E46",
    "accent_sand": "#E6DEC8",
    "accent_whatsapp": "#25D366",
    "font_heading_display": "Outfit",
    "font_heading_serif": "Cormorant Garamond",
    "font_body_sans": "Plus Jakarta Sans"
}

project_files = []
for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['node_modules', '.next', '.git', 'dist', 'scratch']):
        continue
    for f in files:
        if f.endswith(('.jsx', '.js', '.css', '.html', '.json')) and not f.startswith('.'):
            project_files.append(os.path.join(root, f))

print(f"Total project files scanned: {len(project_files)}")

# 1. Color audit
hex_pattern = re.compile(r'#(?:[0-9a-fA-F]{3}){1,2}\b')
known_brand_hexes = {
    '#faf6ee', '#e6dec8', '#141414', '#57534e', '#e5a924', '#c48b12', '#b38e46', '#25d366',
    '#ffffff', '#fff', '#000000', '#000', '#faf7f0',
    # Gold gradient stops
    '#fde8a5', '#c58d17', '#f2be42'
}

color_mismatches = []
for fp in project_files:
    if fp.endswith(('.jsx', '.js', '.css')):
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
            for lno, line in enumerate(f, 1):
                # ignore comments
                if line.strip().startswith('//') or line.strip().startswith('/*'):
                    continue
                matches = hex_pattern.findall(line)
                for m in matches:
                    if m.lower() not in known_brand_hexes:
                        color_mismatches.append((fp, lno, m, line.strip()))

print(f"\n--- COLOR AUDIT: {len(color_mismatches)} non-token hex instances found ---")
by_color_file = {}
for fp, lno, m, line in color_mismatches:
    by_color_file.setdefault(fp, []).append((lno, m, line))
for fp, items in by_color_file.items():
    print(f"{fp}: {len(items)} items")
    for lno, m, line in items[:3]:
        print(f"   L{lno}: {m} -> {line[:80]}")

# 2. Brand Name audit
brand_name_issues = []
brand_regex = re.compile(r'\b(classical\s*decor|dst\s*deco)\b', re.IGNORECASE)
for fp in project_files:
    if fp.endswith(('.jsx', '.js', '.json', '.html')):
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
            for lno, line in enumerate(f, 1):
                if 'import ' in line:
                    continue
                for match in brand_regex.finditer(line):
                    text = match.group(0)
                    # Check casing/spelling
                    # Allowed: "Classical Decor ID", "CLASSICAL DECOR I D", "DST Deco", "dst_deco", "classicaldecorid"
                    pass

# 3. Heading font family audit
heading_regex = re.compile(r'<h([1-4])[^>]*className=["\']([^"\']*)["\']', re.IGNORECASE)
heading_missing_fonts = []
for fp in project_files:
    if fp.endswith('.jsx'):
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
            for lno, line in enumerate(f, 1):
                for match in heading_regex.finditer(line):
                    tag = match.group(1)
                    cls = match.group(2)
                    if not any(f in cls for f in ['font-serif', 'font-display', 'font-sans', 'font-mono']):
                        heading_missing_fonts.append((fp, lno, f"<h{tag}>", cls))

print(f"\n--- TYPOGRAPHY AUDIT: {len(heading_missing_fonts)} headings missing explicit font family ---")
for fp, lno, tag, cls in heading_missing_fonts:
    print(f"   {fp}:{lno} {tag} -> {cls[:70]}")

# 4. Button radius and CTA consistency
button_regex = re.compile(r'<(?:button|Link|a)[^>]*className=["\']([^"\']*)["\']', re.IGNORECASE)
button_radii = {}
for fp in project_files:
    if fp.endswith('.jsx'):
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
            for lno, line in enumerate(f, 1):
                for match in button_regex.finditer(line):
                    cls = match.group(1)
                    if 'rounded-' in cls:
                        for part in cls.split():
                            if part.startswith('rounded-') or part == 'rounded':
                                button_radii[part] = button_radii.get(part, 0) + 1

print(f"\n--- BUTTON RADIUS DISTRIBUTION ---")
for r, count in sorted(button_radii.items(), key=lambda x: x[1], reverse=True):
    print(f"   {r}: {count} occurrences")

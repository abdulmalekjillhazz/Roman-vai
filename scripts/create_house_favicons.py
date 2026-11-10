"""
Generate official Classical Decor ID Golden House Favicons.
Matches authentic business card logo from user uploads:
media_1794228389701_f74c6764.jpg and media_1794228389701_7c742a49.jpg
"""
import os
from PIL import Image, ImageDraw

def render_house_logo(size=512, with_background=True, stroke_color=(229, 169, 36), bg_color=(20, 20, 20)):
    # Create high-res image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 100.0

    if with_background:
        # Rounded luxury charcoal tile
        rx = int(22 * scale)
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=rx, fill=bg_color)
        
        # Elegant gold border
        border_inset = int(3 * scale)
        border_width = max(1, int(1.8 * scale))
        draw.rounded_rectangle(
            [border_inset, border_inset, size - border_inset - 1, size - border_inset - 1],
            radius=int(19 * scale),
            outline=(229, 169, 36, 120),
            width=border_width
        )

    # Line stroke width (slightly thicker on small icons for crispness)
    if size <= 32:
        lw = max(2, int(5.5 * scale))
    elif size <= 48:
        lw = max(3, int(5.0 * scale))
    else:
        lw = max(4, int(4.5 * scale))

    def pt(x, y):
        return (int(round(x * scale)), int(round(y * scale)))

    # 1. Left outer wall + Main Gable + Right outer wall: (18, 92) -> (18, 38) -> (50, 6) -> (82, 38) -> (82, 92)
    path1 = [pt(18, 92), pt(18, 38), pt(50, 6), pt(82, 38), pt(82, 92)]
    for i in range(len(path1) - 1):
        draw.line([path1[i], path1[i + 1]], fill=stroke_color, width=lw, joint='curve')

    # 2. Baseline: from (33, 92) to (82, 92)
    draw.line([pt(33, 92), pt(82, 92)], fill=stroke_color, width=lw)

    # 3. Tall architectural pillar: from (33, 10) to (33, 92)
    draw.line([pt(33, 10), pt(33, 92)], fill=stroke_color, width=lw)

    # 4. Inner overlapping gable slope + hanging drop: (33, 10) -> (65, 42) -> (65, 68)
    path2 = [pt(33, 10), pt(65, 42), pt(65, 68)]
    for i in range(len(path2) - 1):
        draw.line([path2[i], path2[i + 1]], fill=stroke_color, width=lw, joint='curve')

    # 5. Door: (43, 92) -> (43, 72) -> (57, 72) -> (57, 92)
    path3 = [pt(43, 92), pt(43, 72), pt(57, 72), pt(57, 92)]
    for i in range(len(path3) - 1):
        draw.line([path3[i], path3[i + 1]], fill=stroke_color, width=lw, joint='curve')

    return img

def main():
    print("Generating Classical Decor ID Golden House Favicons...")

    # Sizes for multi-resolution favicon.ico
    sizes_ico = [16, 32, 48]
    ico_images = [render_house_logo(s) for s in sizes_ico]

    target_dirs = ['public', 'app', 'client/public']
    for d in target_dirs:
        os.makedirs(d, exist_ok=True)
        ico_path = os.path.join(d, 'favicon.ico')
        ico_images[0].save(ico_path, format='ICO', sizes=[(s, s) for s in sizes_ico], append_images=ico_images[1:])
        print(f"Saved {ico_path} with sizes {sizes_ico}")

        # Touch icons
        img_180 = render_house_logo(180)
        img_180.save(os.path.join(d, 'apple-touch-icon.png'))
        img_180.save(os.path.join(d, 'apple-icon.png'))

        img_192 = render_house_logo(192)
        img_192.save(os.path.join(d, 'icon-192.png'))

        img_512 = render_house_logo(512)
        img_512.save(os.path.join(d, 'icon-512.png'))

    # Also generate the master SVG
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE8A5"/>
      <stop offset="35%" stop-color="#E5A924"/>
      <stop offset="80%" stop-color="#C58D17"/>
      <stop offset="100%" stop-color="#F2BE42"/>
    </linearGradient>
  </defs>

  <!-- Luxury Charcoal Tile for High-Contrast Visibility on any Browser Tab Theme -->
  <rect width="100" height="100" rx="22" fill="#141414"/>

  <!-- Subtle Precision Gold Border -->
  <rect x="2.5" y="2.5" width="95" height="95" rx="19.5" fill="none" stroke="url(#goldGradient)" stroke-width="1.8" stroke-opacity="0.45"/>

  <!-- Official Classical Decor ID Architectural House Icon -->
  <g stroke="url(#goldGradient)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left outer wall and Main Gable to Right outer wall -->
    <path d="M18 92 V38 L50 6 L82 38 V92" />
    <!-- Baseline from tall pillar to right wall (left wall intentionally detached) -->
    <line x1="33" y1="92" x2="82" y2="92" />
    <!-- Tall architectural vertical pillar -->
    <line x1="33" y1="10" x2="33" y2="92" />
    <!-- Inner overlapping gable slope and hanging drop -->
    <path d="M33 10 L65 42 V68" />
    <!-- Central entrance door -->
    <path d="M43 92 V72 H57 V92" />
  </g>
</svg>
'''
    for d in target_dirs:
        svg_path = os.path.join(d, 'icon.svg')
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        print(f"Saved {svg_path}")

    print("All favicons generated successfully!")

if __name__ == '__main__':
    main()

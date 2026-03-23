import sys
from PIL import Image

def aggressive_crop_and_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()
    
    # 1. Find the true bounding box by scanning for non-background colors.
    # The logo uses black (deep grey), yellow, and white text. 
    # Background is white/grey texture. We look for significantly dark or yellow pixels.
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            
            # Is it part of the cart (dark) or yellow bracket?
            is_dark = r < 100 and g < 100 and b < 100
            is_yellow = r > 200 and g > 150 and b < 100
            
            if is_dark or is_yellow:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    # Add 10px buffer
    min_x = max(0, min_x - 10)
    min_y = max(0, min_y - 10)
    max_x = min(w - 1, max_x + 10)
    max_y = min(h - 1, max_y + 10)
    
    # Crop to actual cart!
    cropped = img.crop((min_x, min_y, max_x, max_y))
    
    # 2. Make white/grey textured background transparent!
    cw, ch = cropped.size
    cpixels = cropped.load()
    
    for y in range(ch):
        for x in range(cw):
            r, g, b, a = cpixels[x, y]
            # Strip anything bright/grey
            if r > 180 and g > 180 and b > 180 and not (r > 200 and g > 150 and b < 100):
                # Is it pure white text inside the cart? 
                # White text inside the cart will be >200, but we can preserve it if we only strip border?
                # Actually, making white text transparent against a white/bright header is fine, 
                # but making it transparent on a dark header would ruin it IF it's not enclosed.
                pass 
                
    # Since we use drop-shadow, we need to strip the exterior background.
    # Let's flood fill from edges of cropped image.
    magenta = (255, 0, 255, 255)
    from PIL import ImageDraw
    ImageDraw.floodfill(cropped, (0, 0), magenta, thresh=60)
    ImageDraw.floodfill(cropped, (cw-1, 0), magenta, thresh=60)
    ImageDraw.floodfill(cropped, (0, ch-1), magenta, thresh=60)
    ImageDraw.floodfill(cropped, (cw-1, ch-1), magenta, thresh=60)
    
    # Convert magenta to transparent
    cx, cy = cropped.size
    for y in range(cy):
        for x in range(cx):
            if cpixels[x, y] == magenta:
                cpixels[x, y] = (255, 255, 255, 0)
                
    cropped.save(output_path, "PNG")
    print(f"Success! Cropped {w}x{h} down to {cx}x{cy}")

if __name__ == "__main__":
    aggressive_crop_and_transparent(sys.argv[1], sys.argv[2])

# Script to create www/assets/sprites/{box,stack}_*.png
# This file is NOT a part of the www/ folder and DOES NOT need to be deployed. It is used for development only.

from PIL import Image

SOURCE_DIRECTORY = "www/assets/matches gens_1-12"
DEST_DIRECTORY = "www/assets/sprites"

for i in range(1, 13):
    original_filename = SOURCE_DIRECTORY + f"/{i}MatchInside.png"
    im = Image.open(original_filename)

    # save the image for the box
    (left, upper, right, lower) = (486, 272, 1920, 1356)
    box = im.crop((left, upper, right, lower)) # we crop the image because the originals have a lot of transparent space around the box
    new_box_filename = DEST_DIRECTORY + f"/box_{i}.png"
    box.save(new_box_filename)

    # now we construct the image for the stack, by stacking `i` copies of the box on top of each other
    box_height = 140 # how much higher is one box than the previous
    stack_height = box.height + box_height * (i - 1)
    stack = Image.new('RGBA', (box.width, stack_height), (0, 0, 0, 0))
    for j in range(i):
        y = stack_height - box.height - (box_height * j)
        stack.alpha_composite(box, (0, y))
    new_stack_filename = DEST_DIRECTORY + f"/stack_{i}.png"
    stack.save(new_stack_filename)

print("DONE")
#!/bin/bash

# Specify the folder path
folder_path="./build/public/locales"

existing_logo_path="./build/public/logo.svg"

new_logo_path="./logo.svg"

# Iterate through each JSON file in the folder recursively using find
find "$folder_path" -type f -name "*.json" | while read -r file; do
    # Check if the file exists and is readable
    if [ -r "$file" ]; then
        # Create a temporary file for the changes
        tmp_file=$(mktemp)
        
        # Replace "Medusa" with "The Special Character" in a case-sensitive manner
        sed 's/Medusa/The Special Character/g' "$file" > "$tmp_file"

        # Move the temporary file back to the original file
        mv "$tmp_file" "$file"
        
        echo "Replaced in file: $file"
    else
        echo "Error: Unable to read file - $file"
    fi
done

if [ -r "$new_logo_path" ]; then
    # Replace the existing logo with the new logo
    cp "$new_logo_path" "$existing_logo_path"
    echo "Logo replaced successfully."
else
    echo "Error: New logo file not found or not readable - $new_logo_path"
fi


echo "Replacement process completed."

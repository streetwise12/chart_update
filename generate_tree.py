import os
from pathlib import Path

def generate_directory_tree(startpath, output_file, exclude_dirs=None):
    """
    Generate a directory tree structure and save it to a text file.
    
    Args:
        startpath (str): The root directory to start from
        output_file (str): Path to the output text file
        exclude_dirs (list): List of directory names to exclude (e.g., ['.git', 'node_modules'])
    """
    if exclude_dirs is None:
        exclude_dirs = ['.git', 'node_modules', '__pycache__', '.next']
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"Directory Tree for: {os.path.abspath(startpath)}\n")
        f.write("=" * 50 + "\n\n")
        
        for root, dirs, files in os.walk(startpath):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            level = root.replace(startpath, '').count(os.sep)
            indent = '│   ' * (level)
            f.write(f"{indent}├── {os.path.basename(root)}/\n")
            
            subindent = '│   ' * (level + 1)
            for file in files:
                f.write(f"{subindent}├── {file}\n")

if __name__ == "__main__":
    # Get the current directory
    current_dir = os.getcwd()
    
    # Set the output file path
    output_file = "project_structure.txt"
    
    # Generate the tree
    generate_directory_tree(current_dir, output_file)
    
    print(f"Directory tree has been saved to {output_file}")
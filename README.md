# Chess PGN to GIF Converter

## Project Structure

```
├── main.py                 # Entry point that runs the Flask application
├── app.py                  # Main Flask application configuration and routes
├── pgn_converter.py        # Core PGN to GIF conversion logic
├── static/                 # Static assets directory
│   ├── css/
│   │   └── custom.css      # Custom styling including dark mode
│   ├── js/
│   │   └── main.js        # Client-side JavaScript for board interaction
│   └── img/
│       └── chesspieces/    # SVG chess pieces
│           ├── bB.svg      # Black Bishop
│           ├── bK.svg      # Black King
│           ├── bN.svg      # Black Knight
│           ├── bP.svg      # Black Pawn
│           ├── bQ.svg      # Black Queen
│           ├── bR.svg      # Black Rook
│           ├── wB.svg      # White Bishop
│           ├── wK.svg      # White King
│           ├── wN.svg      # White Knight
│           ├── wP.svg      # White Pawn
│           ├── wQ.svg      # White Queen
│           └── wR.svg      # White Rook
└── templates/              # Jinja2 HTML templates
    ├── base.html          # Base template with layout and common elements
    └── index.html         # Main page template
```

## Key Features

1. **PGN Processing:**
   - File upload support
   - Text input support
   - Validation and error handling

2. **Chess Board Visualization:**
   - Interactive board preview
   - Move navigation controls
   - SVG piece rendering

3. **User Interface:**
   - Dark/Light mode toggle
   - Responsive design
   - Loading indicators
   - Error feedback

4. **Main Dependencies:**
   - Flask for web server
   - python-chess for PGN processing
   - chess.js and chessboard.js for board visualization
   - Bootstrap for styling
   - Font Awesome for icons

## Deploying to Render

To deploy this Flask application on **Render**, follow these steps:

### 1. **Push to GitHub**

Ensure your project is committed and pushed to a GitHub repository.

```sh
 git add .
 git commit -m "Initial commit"
 git push origin main
```

### 2. **Create a New Web Service on Render**

- Go to [Render](https://render.com/)
- Click on **New Web Service**
- Connect your GitHub repository
- Select **Python** as the environment

### 3. **Configure Build and Start Commands**

#### **Build Command:**

```sh
bash render-build.sh
```

#### **Start Command:**

```sh
gunicorn -w 4 -b 0.0.0.0:10000 app:app
```

### 4. **Ensure System Dependencies Are Installed**

Create a file named **render-build.sh** and add the following:

```sh
#!/bin/bash
# Install system dependencies
apt-get update && apt-get install -y libcairo2 libcairo2-dev
pip install -r requirements.txt
```

Make sure the file is executable:

```sh
chmod +x render-build.sh
```

### 5. **Add Required Environment Variables (If Any)**

Under **Environment Settings** in Render, add any required **environment variables**.

### 6. **Deploy and Run**

Click **Deploy**, and Render will build and start your application.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

```
MIT License

Copyright (c) 2025 M.P. Goutam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[...] (Full MIT License text)
```


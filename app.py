import os
import logging
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from pgn_converter import convert_pgn_to_gif

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "chess-pgn-converter-key")
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = '/tmp'

ALLOWED_EXTENSIONS = {'pgn'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' in request.files and request.files['file'].filename:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)

                # Convert PGN to GIF
                gif_path = convert_pgn_to_gif(filepath)

                # Return the generated GIF
                return send_file(gif_path, mimetype='image/gif', as_attachment=True)

        elif 'pgn_text' in request.form and request.form['pgn_text'].strip():
            pgn_text = request.form['pgn_text'].strip()
            logger.debug(f"Received PGN text: {pgn_text}")

            # Save PGN text to temporary file
            temp_pgn = os.path.join(app.config['UPLOAD_FOLDER'], 'temp.pgn')
            with open(temp_pgn, 'w') as f:
                f.write(pgn_text)

            # Convert PGN to GIF
            gif_path = convert_pgn_to_gif(temp_pgn)

            # Return the generated GIF
            return send_file(gif_path, mimetype='image/gif', as_attachment=True)

        logger.error("No valid PGN data received")
        return jsonify({'error': 'No valid PGN file or text provided'}), 400

    except Exception as e:
        logger.error(f"Error processing PGN: {str(e)}")
        return jsonify({'error': str(e)}), 500
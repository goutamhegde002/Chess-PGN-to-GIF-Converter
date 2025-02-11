import chess
import chess.pgn
import chess.svg
from PIL import Image
import io
import os
import cairosvg
import logging

def create_board_image(board, size=400):
    """Create a PNG image of the chess board."""
    svg_data = chess.svg.board(board=board, size=size)
    png_data = cairosvg.svg2png(bytestring=svg_data.encode('utf-8'))
    return Image.open(io.BytesIO(png_data))

def convert_pgn_to_gif(pgn_path, output_path=None):
    """Convert a PGN file to an animated GIF."""
    try:
        # Read PGN file
        with open(pgn_path) as pgn_file:
            game = chess.pgn.read_game(pgn_file)
        
        if game is None:
            raise ValueError("Invalid PGN format or empty file")

        # Initialize board
        board = game.board()
        frames = []
        
        # Create first frame
        frames.append(create_board_image(board))
        
        # Process moves
        for move in game.mainline_moves():
            board.push(move)
            frames.append(create_board_image(board))
        
        # Generate output path if not provided
        if output_path is None:
            output_path = os.path.join('/tmp', 'chess_game.gif')
        
        # Save as GIF
        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:],
            duration=1000,  # 1 second per move
            loop=0
        )
        
        return output_path
    
    except Exception as e:
        logging.error(f"Error converting PGN to GIF: {str(e)}")
        raise

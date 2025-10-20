from flask import Flask, request, send_from_directory
from waitress import serve
import queue
import argparse
import sys

# default port if none provided via CLI
PORT = 2004

app = Flask(__name__, static_folder="public", static_url_path="")

# each client connection has its own queue
clients = []

@app.route("/")
@app.route("/<path:filename>")
def static_files(filename="index.html"):
    if 'u' in request.args:
        username = request.args.get('u')
        print(f"User connected with username: {username}")
        send_new_user_message(username)
        return send_from_directory("public", filename)
    else:
        print("User connected with no username")
        return send_from_directory("public", filename if filename != "index.html" else "login.html")

# POST: receives a message from one client and forwards it to all other connections
@app.route("/api/messages", methods=["POST"])
def post_message():
    payload = request.get_data(as_text=True)
    for q in clients[:]:
        try:
            q.put(payload)
        except:
            clients.remove(q)
    return '', 204

# GET: all clients listen here, with long-polling
@app.route("/api/messages", methods=["GET"])
def get_messages():
    q = queue.Queue()
    clients.append(q)
    try:
        # wait up to 30 seconds for a message
        msg = q.get(timeout=30)
        return msg, 200
    except queue.Empty:
        return '', 204  # no message, client retries
    finally:
        clients.remove(q) # clean up client queue on disconnect

def send_new_user_message(username):
    welcome_message = f'{{"type": "system", "content": "Now entering room: {username}"}}'
    for q in clients[:]:
        try:
            q.put(welcome_message)
        except:
            clients.remove(q)

if __name__ == "__main__":
    import socket

    parser = argparse.ArgumentParser(description="run pctochat web server")
    parser.add_argument("--port", "-p", type=int, help="port to listen on (default: %(default)s)", default=PORT)
    parser.add_argument("--server", "-s", action="store_true", help="run server in headless mode without opening a browser")
    args = parser.parse_args()

    port = args.port or PORT

    # get local IP address
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))  # doesn't actually send data
        local_ip = s.getsockname()[0]
    except Exception:
        local_ip = "localhost"
    finally:
        s.close()

    print(f"\nServer running!")
    print(f" → Local:   http://127.0.0.1:{port}")
    print(f" → Network: http://{local_ip}:{port}\n")

    if not (1 <= port <= 65535):
        print(f"Error: port {port} is out of range (1-65535)")
        sys.exit(2)
    
    open_browser = not args.server

    if open_browser:
        import webbrowser
        webbrowser.open(f"http://{local_ip}:{port}")

    serve(app, host="0.0.0.0", port=port)
class Node {
    constructor(x, y, walkable) {
        this.x = x;
        this.y = y;
        this.walkable = walkable;
        this.g_score = Infinity;
        this.f_score = Infinity;
        this.came_from = null;
    }
}

class Maze {
    constructor(grid) {
        this.grid = grid;
        this.start = null;
        this.end = null;
        this.width = grid[0].length;
        this.height = grid.length;
        this.nodes = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let node = null;
                if (grid[y][x] === "S" || grid[y][x][0] == "S") {
                    this.start = new Node(x, y, true);
                    node = this.start;
                } else if (grid[y][x] === "E" || grid[y][x][0] == "E") {
                    this.end = new Node(x, y, true);
                    node = this.end;
                } else if (grid[y][x] === " " || grid[y][x][0] == " ") {
                    node = new Node(x, y, true);
                } else {
                    node = new Node(x, y, false);
                }
                this.nodes.push(node);
            }
        }
    }

    euclidean_distance(node1, node2) {
        return Math.sqrt((node1.x - node2.x)**2 + (node1.y - node2.y)**2);
    }

    get_neighbors(node) {
        const neighbors = [];
        for (const [dx, dy] of [[0, 2], [2, 0], [0, -2], [-2, 0]]) {
            let x = node.x + dx;
            let y = node.y + dy;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                continue;
            }
            const neighbor = this.nodes[y * this.width + x];
            if (!neighbor.walkable) {
                continue;
            }
            let path_blocked = false;
            if (dx === 0) {
                for (let i = Math.min(node.y, neighbor.y) + 1; i < Math.max(node.y, neighbor.y); i++) {
                    if (!this.nodes[i * this.width + x].walkable) {
                        path_blocked = true;
                        break;
                    }
                }
            } else if (dy === 0) {
                for (let i = Math.min(node.x, neighbor.x) + 1; i < Math.max(node.x, neighbor.x); i++) {
                    if (!this.nodes[y * this.width + i].walkable) {
                        path_blocked = true;
                        break;
                    }
                }
            }
            if (!path_blocked) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }

    reconstruct_path(node) {
        const path = [];
        let current = node;
        while (current !== null) {
            path.unshift(current);
            current = current.came_from;
        }
        return path;
    }

    a_star() {
        this.start.g_score = 0;
        this.start.f_score = this.euclidean_distance(this.start, this.end);
        const open_list = [this.start];
        const closed_list = [];

        while (open_list.length > 0) {
            const current = open_list.shift();
            if (current === this.end) {
                return this.reconstruct_path(this.end);
            }
            closed_list.push(current);
            for (const neighbor of this.get_neighbors(current)) {
                if (closed_list.includes(neighbor)) {
                    continue;
                }
                const tentative_g_score = current.g_score + this.euclidean_distance(current, neighbor);
                if (tentative_g_score < neighbor.g_score || !open_list.includes(neighbor)) {
                    neighbor.came_from = current;
                    neighbor.g_score = tentative_g_score;
                    neighbor.f_score = neighbor.g_score + this.euclidean_distance(neighbor, this.end);
                    if (!open_list.includes(neighbor)) {
                        open_list.push(neighbor);
                    }
                }
            }
            open_list.sort((a, b) => a.f_score - b.f_score);
        }
    }
}





const grid = [
    [["S", [0, 0]], " ", [" ", [1, 0]], " ", [" ", [2, 0]]],
    ["#", " ", " ", " ", " "],
	[[" ", [0, 1]], " ", [" ", [1, 1]], " ", [" ", [2, 1]]],
	[" ", " ", " ", " ", " "],
	[["E", [0, 2]], "#", [" ", [1, 2]], " ", [" ", [2, 2]]]
];

function getDirections(path) {
    if (path.length === 0) {
        return null;
    }
    const directions = [];
    for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        if (dx === 2) {
            directions.push("right");
        } else if (dx === -2) {
            directions.push("left");
        } else if (dy === 2) {
            directions.push("bottom");
        } else if (dy === -2) {
            directions.push("top");
        }
    }
    return directions;
}

function findPath(grid) {
   const maze = new Maze(grid);
   const path = maze.a_star();
   return getDirections(path)
}


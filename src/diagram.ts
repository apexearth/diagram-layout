import {DiagramNode} from "./DiagramNode";

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    node: DiagramNode;
}

interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export const createDiagram = (root: DiagramNode) => {
    let rectangles: Rectangle[] = [];
    let lines: Line[] = [];
    createNode(root, rectangles, lines);
    return {rectangles, lines};
};

export const createNode = (node: DiagramNode, rectangles: Rectangle[], lines: Line[]) => {
    rectangles.push({
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        node,
    });
    node.children.forEach(child => {
        lines.push({
            x1: node.x + node.width / 2,
            y1: node.y + node.height / 2,
            x2: child.x + child.width / 2,
            y2: child.y + child.height / 2,
        });
        createNode(child, rectangles, lines);
    });
};


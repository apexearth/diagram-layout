import {deepStrictEqual, strictEqual} from 'assert';
import {DiagramNode} from "./DiagramNode";

describe('DiagramNode', function () {
    it('should spread out the nodes appropriately to avoid collisions', function () {
        const node = new DiagramNode({
            options: {
                width: 80,
                height: 30,
                spacing: 20,
            }
        });
        node.add();

        deepStrictEqual(node.coords, {x: 0, y: 0});
        deepStrictEqual(node.children[0].coords, {x: 100, y: 0});

        node.add();
        deepStrictEqual(node.children[0].coords, {x: 100, y: -25});
        deepStrictEqual(node.children[1].coords, {x: 100, y: 25});

        node.add();
        deepStrictEqual(node.children[0].coords, {x: 100, y: -50});
        deepStrictEqual(node.children[1].coords, {x: 100, y: 0});
        deepStrictEqual(node.children[2].coords, {x: 100, y: 50});

        node.add();
        deepStrictEqual(node.children[0].coords, {x: 100, y: -75});
        deepStrictEqual(node.children[1].coords, {x: 100, y: -25});
        deepStrictEqual(node.children[2].coords, {x: 100, y: 25});
        deepStrictEqual(node.children[3].coords, {x: 100, y: 75});

        node.children[1].add();
        node.children[2].add();
        deepStrictEqual(node.children[1].coords, {x: 100, y: -25});
        deepStrictEqual(node.children[2].coords, {x: 100, y: 25});
        deepStrictEqual(node.children[1].children[0].coords, {x: 200, y: -25});
        deepStrictEqual(node.children[2].children[0].coords, {x: 200, y: 25});

        node.children[1].add();
        node.children[2].add();
        deepStrictEqual(node.coords, {x: 0, y: 0});
        deepStrictEqual(node.children[0].coords, {x: 100, y: -150});
        deepStrictEqual(node.children[1].coords, {x: 100, y: -50});
        deepStrictEqual(node.children[2].coords, {x: 100, y: 50});
        deepStrictEqual(node.children[3].coords, {x: 100, y: 150});

        const a = node.children[1].children[1];
        const b = node.children[2].children[0];
        strictEqual(a.isCollision(b), false);
        deepStrictEqual(a.coords, {x: 200, y: -25});
        deepStrictEqual(b.coords, {x: 200, y: 25});

        node.children[1].add();
        deepStrictEqual(node.coords, {x: 0, y: 0});
        deepStrictEqual(node.children[0].coords, {x: 100, y: -225});
        deepStrictEqual(node.children[1].coords, {x: 100, y: -75});
        deepStrictEqual(node.children[2].coords, {x: 100, y: 75});
        deepStrictEqual(node.children[3].coords, {x: 100, y: 225});

        deepStrictEqual(node.children[1].children[2].coords, {x: 200, y: -25});
        deepStrictEqual(node.children[2].children[0].coords, {x: 200, y: 50});
    });
    it('overlap scenario 2', () => {
        const root = new DiagramNode({
            options: {
                width: 80,
                height: 30,
                spacing: 20,
            }
        });
        root.add();
        root.add();
        root.add();
        root.add();

        root.children[1].add();
        root.children[1].add();
        root.children[1].add();
        root.children[2].add();
        root.children[2].add();

        deepStrictEqual(root.children[1].children[2].coords, {
            "x": 200,
            "y": -25,
        });
        deepStrictEqual(root.children[2].children[0].coords, {
            "x": 200,
            "y": 50,
        });
    });
    it('bounds logic', () => {
        const root = new DiagramNode();
        deepStrictEqual(root.bounds, {left: -5, top: -2.5, right: 5, bottom: 2.5});

        root.add();
        deepStrictEqual(root.children[0].bounds, {left: 15, top: -2.5, right: 25, bottom: 2.5});

        root.add();
        root.children[0].add();
        root.children[0].add();

        root.children[0].children[0].add();
        root.children[0].children[0].add();

        root.children[1].add();
        root.children[1].children[0].add();
        root.children[1].children[0].add();
        root.children[1].add();

        process.env.DEBUGGER = "true";
        deepStrictEqual(root.children[0].children[1].bounds, {left: 15, top: -2.5, right: 25, bottom: 2.5});

        root.children[0].add();

        root.children[0].add();


        root.children[0].children[0].add();
        root.children[0].children[0].add();

        root.children[1].add();
        root.children[1].children[0].add();

        deepStrictEqual(root.children[1].children[0].bounds, {left: -5, top: -2.5, right: 25, bottom: 2.5});
        root.add();
        /*
           - -
        */
        deepStrictEqual(root.bounds, {left: -5, top: -2.5, right: 25, bottom: 2.5});

        root.add();
        /*
             -
           -
             -
         */
        deepStrictEqual(root.bounds, {left: -5, top: -10, right: 25, bottom: 10});

        root.children[0].add();
        /*
             - -
           -
             -
         */
        deepStrictEqual(root.bounds, {left: -5, top: -10, right: 45, bottom: 10});
        deepStrictEqual(root.children[0].bounds, {bottom: -5, left: 15, right: 45, top: -10});
        deepStrictEqual(root.children[1].bounds, {bottom: 10, left: 15, right: 25, top: 5});

        root.children[0].add();
        /*
               -
             -
               -
           -
             -
         */
        strictEqual(root.children[0].relativeTop(), -15);
        strictEqual(root.children[0].relativeBottom(), 15);

        root.children[0].children[0].add();
        root.children[0].children[0].add();
        /*
                 -
               -
                 -
             -
               -
           -
             -
         */
        strictEqual(root.children[0].relativeTop(), -27.5);
        strictEqual(root.children[0].relativeBottom(), 15);
        strictEqual(root.children[0].relativeHeight, 42.5);
    });
    describe('attribute checks', () => {
        const root = new DiagramNode();
        root.add();
        root.add();
        root.children[0].add();
        root.children[0].add();
        root.children[0].add();
        root.children[0].children[0].add();
        root.children[0].children[0].children[0].add();
        root.children[0].children[0].children[0].add();
        root.children[0].children[1].add();
        root.children[0].children[1].children[0].add();
        root.children[0].children[1].children[0].add();

        it('.objectHeight', () => {
            strictEqual(root.children[0].children[0].objectHeight, 10);
            strictEqual(root.children[0].objectHeight, 25);
            strictEqual(root.objectHeight, 30);
        });
        it('.totalCount', () => {
            strictEqual(root.children[0].children[0].totalCount, 4);
            strictEqual(root.children[0].totalCount, 10);
            strictEqual(root.totalCount, 12);
        });
        it('.totalLeafs', () => {
            strictEqual(root.children[0].children[0].totalLeafs, 2);
            strictEqual(root.children[0].totalLeafs, 5);
            strictEqual(root.children[1].totalLeafs, 1);
            strictEqual(root.totalLeafs, 6);
        });
        it('.spacingHeight', () => {
            strictEqual(root.children[0].children[0].spacingHeight, 10);
            strictEqual(root.children[0].spacingHeight, 40);
        });
        it('.relativeHeight', () => {
            strictEqual(root.children[0].children[0].relativeHeight, 20);
            strictEqual(root.children[0].relativeHeight, 65);
            strictEqual(root.children[1].relativeHeight, 5);
            strictEqual(root.relativeHeight, 80);
        });
    });
});
import {DiagramNode} from './DiagramNode';

export const createData = () => {
    const root = new DiagramNode({
        options: {
            width: 10, height: 10, spacing: 10
        }
    });
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
    let generate = false;
    document.onclick = () => generate = !generate;
    setInterval(() => {
        if (!generate) return;
        const all = root.all;
        all[Math.floor(all.length / 3 * 2 + Math.random() * all.length / 3)].add();
    }, 200);
    return root;
};
export class DiagramNode<T = undefined> {
    public get root(): DiagramNode<T> {
        return this.parent ? this.parent.root : this;
    }

    public get all(): DiagramNode<T>[] {
        return [this, ...this.root.descendants];
    }

    public get x(): number {
        if (!this.parent) return 0;
        return this.parent.x + this.width + this.options.spacing + this.shift.x;
    }

    public get y(): number {
        if (!this.parent) return 0;
        return this.parent.y + this.relativeY;
    }

    public get relativeY(): number {
        if (!this.parent || this.parent.children.length === 1) return 0;
        if (process.env.DEBUGGER === "true") debugger
        const yStartOffset = -this.parent.relativeHeight / 2 + this.relativeHeight / 2;
        let yOffset = 0;
        for (let child of this.parent.children.filter(child => child.index < this.index)) {
            yOffset += child.relativeHeight + child.options.spacing;
        }
        return yOffset + yStartOffset + this.shift.y;
    }

    public get coords() {
        return {
            x: this.x,
            y: this.y
        };
    }

    public get width(): number {
        return this.options.width;
    }

    public get height(): number {
        return this.options.height;
    }

    public get left(): number {
        return this.x - this.width / 2;
    }

    public get top(): number {
        return this.children.length > 0 ? this.children[0].top : this.y - this.height / 2;
    }

    public get right(): number {
        return this.children.length > 0 ? this.children[0].right : this.x + this.width / 2;
    }

    public get bottom(): number {
        return this.children.length > 0 ? this.children[this.children.length - 1].bottom : this.y + this.height / 2;
    }

    public get bounds() {
        return {
            left: this.left,
            top: this.top,
            right: this.right,
            bottom: this.bottom,
        };
    }

    public get objectHeight(): number {
        return this.children.length > 0 ? this.children.reduce((sum, {objectHeight}) => sum + objectHeight, 0) : this.height;
    }

    public get totalCount(): number {
        return this.children.length > 0 ? this.children.reduce((sum, child) => sum + child.totalCount, 1) : 1;
    }

    public get totalLeafs(): number {
        return this.children.length > 0 ? this.children.reduce((sum, child) => sum + child.totalLeafs, 0) : 1;
    }

    public get spacingHeight(): number {
        return (this.totalLeafs - 1) * this.options.spacing;
    }

    public relativeTop(y = 0): number {
        return y - (this.spacingHeight + this.objectHeight) / 2;
    }

    public relativeBottom(y = 0): number {
        return y + (this.spacingHeight + this.objectHeight) / 2;
    }

    public get relativeHeight(): number {
        return this.objectHeight + this.spacingHeight;
    }

    public readonly parent?: DiagramNode<T>;
    public readonly children: DiagramNode<T>[];
    public readonly descendants: DiagramNode<T>[] = [];
    public readonly data?: T;
    public readonly index: number;
    public readonly shift = {x: 0, y: 0};
    public options = {
        width: 10,
        height: 5,
        spacing: 10,
    };

    constructor(params: {
        parent?: DiagramNode<T>;
        children?: DiagramNode<T>[];
        data?: T;
        index?: number;
        options?: {
            width: number;
            height: number;
            spacing: number;
        };
    } = {}) {
        this.parent = params.parent;
        this.data = params.data;
        this.children = params.children || [];
        this.index = params.index || 0;
        this.options = params.options || this.options;
    }

    public add() {
        const node = new DiagramNode<T>({
            parent: this,
            index: this.children.length,
            options: this.options,
        });
        this.children.push(node);
        this.root.descendants.push(node);
    }

    public isCollision(other: DiagramNode<T>) {
        const result = other !== this && !(
            this.x + this.width + this.options.spacing <= other.x ||
            this.y + this.height + this.options.spacing <= other.y ||
            this.x >= other.x + other.width + this.options.spacing ||
            this.y >= other.y + other.height + this.options.spacing
        );
        //  if (result) debugger
        return result;
    }
}
export class PlayerName {
    name: string;
    name_yomi: string;

    constructor( plObj ) {
        this.name = plObj.name;
        this.name_yomi = plObj.name_yomi;
    }
}

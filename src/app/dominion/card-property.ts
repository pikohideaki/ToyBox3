

export class CardProperty {
    no                      : number;
    card_ID                 : string;
    name_jp                 : string;
    name_jp_yomi            : string;
    name_eng                : string;
    set_name                : string;
    cost                    : CardCost;
    category                : string;
    card_type               : string;
    VP                      : number;
    draw_card               : number;
    action                  : number;
    buy                     : number;
    coin                    : number;
    VPtoken                 : number;
    effect                  : string;
    description             : string;
    recommended_combination : string;
    memo                    : string;
    implemented             : boolean;
    randomizer_candidate    : boolean;

	constructor( cpObj ) {
        Object.keys( cpObj )
            .filter( key => key != "cost" )
            .forEach( key => this[key] = cpObj[key] );

        this.cost = new CardCost( cpObj.cost.coin, cpObj.cost.potion, cpObj.cost.debt );
    }


    costStr(): string {
        let costStr = "";
        if ( this.cost.coin > 0 || ( this.cost.potion == 0 && this.cost.debt == 0 ) ) {
            costStr += this.cost.coin.toString();
        }
        if ( this.cost.potion > 0 ) {
            for ( let i = 0; i < this.cost.potion; ++i ) costStr += 'P';
        }
        if ( this.cost.debt   > 0 ) {
            costStr += `<${this.cost.debt.toString()}>`;
        }
        return costStr;
    }


    transform(): any {
        return {
            no                      : this.no                      ,
            card_ID                 : this.card_ID                 ,
            name_jp                 : this.name_jp                 ,
            name_jp_yomi            : this.name_jp_yomi            ,
            name_eng                : this.name_eng                ,
            set_name                : this.set_name                ,
            cost_coin               : this.cost.coin               ,
            cost_potion             : this.cost.potion             ,
            cost_debt               : this.cost.debt               ,
            costStr                 : this.costStr()               ,
            category                : this.category                ,
            card_type               : this.card_type               ,
            VP                      : this.VP                      ,
            draw_card               : this.draw_card               ,
            action                  : this.action                  ,
            buy                     : this.buy                     ,
            coin                    : this.coin                    ,
            VPtoken                 : this.VPtoken                 ,
            effect                  : this.effect                  ,
            description             : this.description             ,
            recommended_combination : this.recommended_combination ,
            memo                    : this.memo                    ,
            implemented             : ( this.implemented ?  '実装済み' : '未実装' ),
            randomizer_candidate    : ( this.randomizer_candidate ?  '〇' : '×' ),
        };
    }


}


class CardCost {
  coin   : number = 0;
  potion : number = 0;
  debt   : number = 0;

  constructor( coin: number, potion: number, debt: number ) {
    this.coin   = coin;
    this.potion = potion;
    this.debt   = debt;
  }

}

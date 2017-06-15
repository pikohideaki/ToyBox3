import { Injectable } from '@angular/core';

@Injectable()
export class MyUtilitiesService {

  constructor() { }

  localStorage_set( key: string, value: any ) {
    localStorage.setItem( key, JSON.stringify( value ) );
  }

  localStorage_get( key: string ) {
    return JSON.parse( localStorage.getItem( key ) );
  }

  localStorage_has( key: string ): boolean {
    return ( localStorage.getItem( key ) != null );
  }

  submatch( target: string, key: string, ignoreCase: boolean = false ): boolean {
    if ( ignoreCase ) {
      return this.submatch( target.toUpperCase(), key.toUpperCase() );
    }
    return target.indexOf( key ) !== -1;
  }

  objectForEach( object: any, f: (element: any, key?: any, object?: any) => any ) {
    Object.keys( object ).forEach( key => f( object[key], key, object ) );
  }


  toYMD( date: Date ): string {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  toHMS( date: Date ): string {
    let padzero = ( str => ("00" + str).slice(-2) );
    return `${padzero(date.getHours())}:${padzero(date.getMinutes() + 1)}:${padzero(date.getSeconds())}`;
  }

  toYMDHMS( date: Date ): string {
    return `${this.toYMD( date )} ${this.toHMS( date )}`;
  }

  getYestereday( date: Date ): Date {
    let yestereday = new Date( date );
    yestereday.setDate( yestereday.getDate() - 1 );  // yesterday
    return yestereday;
  }

  getTommorow( date: Date ): Date {
    let tommorow = new Date( date );
    tommorow.setDate( tommorow.getDate() - 1 );  // yesterday
    return tommorow;
  }

  getMidnightOfDate( date: Date ): Date {
    let midnight = new Date( date );
    midnight.setHours(0);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return midnight;
  }

  roundAt( val: number, precision: number ) {
    let digit = Math.pow(10, precision);
    val *= digit;
    val = Math.round( val );
    return val / digit;
  }

  RandomNumber( Min: number, Max: number ): number {
    return Min + Math.floor( Math.random() * ( Max - Min + 1 ) );
  }

  isEmpty( ar: any[] ): boolean {
    return ar.length === 0;
  }

  back<T>( ar: Array<T> ): T {
    return ar[ ar.length - 1 ];
  };

  front<T>( ar: Array<T> ): T {
    return ar[0];
  };

  removeIf<T>( ar: Array<T>, f: (T) => boolean ): T {
    return this.removeAt( ar, ar.findIndex(f) );
  }

  removeAt<T>( ar: Array<T>, index: number ): T {
    return ar.splice( index, 1 )[0];
  };

  removeValue<T>( ar: Array<T>, target: T ): Array<T> {
    return ar.filter( e => e != target );
  };

  append( ar1: any[], ar2: any[] ): any[] {
    return [].concat( ar1, ar2 );
  }


  // let a = [ 1,2,3,[1,2,3],5 ];
  // let b = this.utils.makeShallowCopy(a);
  // a[2] = 999;
  // a[3][1] = 9999;
  // console.log( a,b );
  copy<T>( ar: Array<T> ): Array<T> {
    return [].concat( ar );
  }


  shallowCopy( obj, asArray?: boolean ) {
    if ( asArray ) return Object.assign([], obj);
    return Object.assign({}, obj);
  }

  filterRemove<T>( array: Array<T>, f: (T) => boolean ): [ Array<T>, Array<T> ] {
    let others = array.filter( (e) => !f(e) );
    return [ array.filter(f), others ];
  };

  // copy and return unique array
  // 要素の値を定義する関数（この値の同値性でuniqをかける
  uniq<T>( ar: Array<T>, f: (T) => any = ( (e) => e ) ) {
    return ar.map( (e) => [ e, f(e) ] )
        .filter( (val, index, array ) => (array.map( a => a[1] ).indexOf( val[1] ) === index) )
        .map( a => a[0] );
  };

  sortNumeric( array: any[] ): any[] {
    return array.sort( (a,b) => ( parseFloat(a) - parseFloat(b) ) );
  };


  shuffle( array: any[] ): any[] {
    return array
        .map( (e) => [e, Math.random()] )
        .sort( (x, y) => x[1] - y[1] )
        .map( (pair) => pair[0] );
  }

  permutation( n: number ): number[] { 
    let ar = new Array<number>(n);
    for ( let i = 0; i < n; ++i ) { ar[i] = i; }
    return this.shuffle( ar );
  }

  setDifference( sortedArray1: number[], sortedArray2: number[] ): number[] {
    let result: number[] = [];
    let it1 = 0;  // iterator for sortedArray1
    let it2 = 0;  // iterator for sortedArray2
    let val1 = sortedArray1[it1];
    let val2 = sortedArray2[it2];
    while ( it1 < sortedArray1.length && it2 < sortedArray2.length ) {
      if ( val1 == val2 ) {
        val1 = sortedArray1[++it1];
        val2 = sortedArray2[++it2];
      } else if ( val1 < val2 ) {
        result.push(val1);
        val1 = sortedArray1[++it1];
      } else {
        val2 = sortedArray2[++it2];
      }
    }
    for ( ; it1 < sortedArray1.length; ++it1 ) {
      result.push( sortedArray1[it1] );
    }
    return result;
  }

  getRandomValue<T>( array: Array<T> ): T{
    return array[ this.RandomNumber( 0, array.length - 1 ) ];
  }

  sleep( sec: number ): Promise<any> {
    return new Promise( resolve => setTimeout( resolve, sec * 1000 ) );
  }
}


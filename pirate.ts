
const allJewels = 100;

pirate([100,0,0], 5);



function pirate( arrayPrev, times ) {
    if ( times < 0 ) return;

    // newArray[0] :== 分配した人の取り分
    let newArray = new Array( arrayPrev.length + 1 ).fill(0);
    newArray[0] = allJewels;

    const requiredVote = (arrayPrev.length + 1) / 2;  // 自分以外に必要な票数

    let indexSortedByValue
      = arrayPrev.map( (value, index, _) => [value,index] )
                 .sort( (a,b) => a[0] - b[0] )
                 .map( e => e[1] )
                 .slice( 0, requiredVote );

    indexSortedByValue.forEach( index => {
        const newPortion = arrayPrev[index] + 1;
        newArray[index + 1] = newPortion;
        newArray[0] -= newPortion;  // 自分の取り分の計算
    } );

    // 途中経過
    console.log( newArray );

    pirate( newArray, times - 1 );
}


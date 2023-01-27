

export const average = (arr: any[]) => sum(arr) / arr.length;

export const sum = (arr: any[]) => arr.reduce( ( p, c ) => p + c, 0 );

export function median(values: any[]){
    if(values.length ===0) throw new Error("No inputs");
  
    values.sort(function(a,b){
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
    
    if (values.length % 2)
      return values[half];
    
    return (values[half - 1] + values[half]) / 2.0;
  }

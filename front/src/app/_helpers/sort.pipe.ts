import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {
  transform(value: any[], criteria: SortCriteria): any[] {
    if (!value || !criteria)
      return value;
    let p: string = criteria.property;

    let sortFn: (a: any, b: any) => any = (a, b) => {
      let value: number = 0;
      if (a[p] === undefined) value = -1;
      else if (b[p] === undefined) value = 1;
      else {
        const aValue = this.getComparableValue(a[p]);
        const bValue = this.getComparableValue(b[p]);

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Convert string values to lowercase for case-insensitive comparison
          value = aValue.toLowerCase() > bValue.toLowerCase() ? 1 : bValue.toLowerCase() > aValue.toLowerCase() ? -1 : 0;
        } else {
          // Use standard comparison for other types
          value = aValue > bValue ? 1 : bValue > aValue ? -1 : 0;
        }
      }
      return criteria.descending ? value * -1 : value;
    };

    value.sort(sortFn);
    return value;
  }

  private getComparableValue(value: any): any {
    // Convert the value to a number if it's a numeric string
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }

    // Convert date string to number if it matches the format "YYYY-MM-DD"
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof value === 'string' && dateRegex.test(value)) {
      const dateParts = value.split('-');
      return new Date(`${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`).getTime();
    }

    return value;
  }
}


export interface SortCriteria {
  property: string;
  descending?: boolean;
}
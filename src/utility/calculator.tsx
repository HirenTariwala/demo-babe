import { StarProps } from '../props/profileProps';

export const CalculatorHelper = {
  priceFormat(price: number): string {
    // return this.numberToAbbreviatedString(price, '');
    if (price >= 1000000) {
      const p = (price / 1000000).toFixed(2).toString();
      return p + 'M';
    } else if (price >= 1000) {
      const p = (price / 1000).toFixed(2).toString();
      return p + 'k';
    } else {
      return price.toString();
    }
  },

  viewFormat(price: number): string {
    // return this.numberToAbbreviatedString(price, '1');
    if (price >= 1000000) {
      const p = (price / 1000000).toFixed(1).toString();
      return p + 'M';
    } else if (price >= 1000) {
      const p = (price / 1000).toFixed(1).toString();
      return p + 'k';
    } else {
      return price.toString();
    }
  },

  numberToAbbreviatedString(num: number, fixedDecimal: string): string {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(Number(fixedDecimal))}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(Number(fixedDecimal))}k`;
    }
    return num.toString();
  },

  weightedAverage(data: StarProps | undefined): string {
    if (!data) return '---';

    const { totalValue, totalStars } = this.calculateTotalValueAndStars(data);
    const avg = totalValue / totalStars;

    return Number.isNaN(avg) ? '---' : `${avg.toFixed(1)} (${this.priceFormat(totalStars)})`;
  },

  weightedAverageValue(data: StarProps | undefined): number {
    if (!data) return 0;

    const { totalValue, totalStars } = this.calculateTotalValueAndStars(data);
    const avg = totalValue / totalStars;

    return Number.isNaN(avg) ? 0 : avg;
  },

  calculateTotalValueAndStars(data: StarProps): {
    totalValue: number;
    totalStars: number;
  } {
    let totalValue = 0;
    let totalStars = 0;

    Object.entries(data).forEach(([key, value]: [string, number]) => {
      const sanitizedValue = value < 0 ? 0 : value;
      totalStars += sanitizedValue;
      totalValue += Number(key) * sanitizedValue;
    });

    return { totalValue, totalStars };
  },

  numberOfMeetups(data: StarProps | undefined): number {
    if (!data) return 0;

    return Object.values(data).reduce((acc: number, value: number) => acc + value, 0);
  },
};

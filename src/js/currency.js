const currency = {
    VND: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    defaultCurrency: 'VND',
    format(amount, curr = this.defaultCurrency) {
        if (this[curr]) {
            return this[curr].format(amount);
        }
        return amount.toLocaleString('de-DE');;
    }
}
export default currency;

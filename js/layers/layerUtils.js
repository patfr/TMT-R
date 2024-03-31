function resourceDisplay(amount, name, color, precision = 2) {
    return `You have <h2 style="color: ${color};text-shadow:0 0 10px ${color}">${format(amount, precision)}</h2> ${name}`;
}
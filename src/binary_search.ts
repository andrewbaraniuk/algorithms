function seek(search: number, lowest: number, highest: number): number {
    if (lowest > highest) {
        console.log('❌ Not found!');
        return -1;
    }

    const middle_guess = Math.floor((lowest + highest) / 2);
    console.log('↔️  Middle guess: ', middle_guess);

    if (middle_guess === search) {
        console.log('✅ Found!', middle_guess);
        return middle_guess;
    }

    if (middle_guess > search) {
        console.log('⬅️  Too high — new highest: ', middle_guess - 1);
        return seek(search, lowest, middle_guess - 1);
    }

    console.log('➡️  Too low — new lowest: ', middle_guess + 1);
    return seek(search, middle_guess + 1, highest);
}

export function binarySearch(search: number, total: number): number {
    return seek(search, 1, total);
}
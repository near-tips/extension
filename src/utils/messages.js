
export const pendingMessage = (tipAmount, authorNicknames) => `⏳ You're sending ${tipAmount} Ⓝ to ${authorNicknames.join(', ')}`;
export const successMessage = (tipAmount, authorNicknames) => `🦄 Well done! You've sent ${tipAmount} Ⓝ to ${authorNicknames.join(', ')}`;
export const failureMessage = '☹️ Something went wrong and your tips weren\'t sent :(';

export function encodeURIForDb(text: string) {
    return text.toLowerCase().replaceAll(' ', '-').replaceAll("'", '-').replaceAll('"', '');
}
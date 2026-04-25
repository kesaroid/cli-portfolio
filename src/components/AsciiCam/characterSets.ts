export const CHAR_SETS = {
  standard: ' .:-=+*#%@MB',
  simple: ' .+#@',
  blocks: ' ░▒▓█',
  matrix: ' 01',
  edges: '  .,-_~:;=!*#$@',
  dense: ' .`^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  lines: ' ─│┌┐└┘├┤┬┴┼',
  heavyLines: ' ═║╔╗╚╝╠╣╦╩╬',
  invertedBlocks: ' █▓▒░ ',
  braille: ' ⠁⠃⠇⡇⣇⣧⣷⣿',
  dots: ' .•◦●◉',
  circles: ' .oO◌◎●',
  spark: " .`'^*✦✧✶✹",
  tech: ' .:+=xX$#',
  digital: ' .:-=+*#%@',
  alphabetic: ' .abcdefghijklmnopqrstuvwxyz',
  upperAlpha: ' .ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numeric: ' 0123456789',
  mixed: ' .:-=+*#%@abcdefghijklmnopqrstuvwxyz',
  arrows: ' .<>^v',
  binaryDense: ' 01#@',
  runic: ' .ᚠᚢᚦᚨᚱᚲᚷᚹ',
} as const;

export type CharacterSetKey = keyof typeof CHAR_SETS;

export const CHARACTER_SET_KEYS = Object.keys(CHAR_SETS) as CharacterSetKey[];

export interface AsciiCamSettings {
  fontSize: number;
  colorMode: boolean;
  characterSet: CharacterSetKey;
}

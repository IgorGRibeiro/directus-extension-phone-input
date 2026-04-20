# Phone Input for Directus

A Directus bundle providing a phone number **interface** and matching **display** built on [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js). Pick a country, type freely, and the input formats as you go, validates on blur, and stores the value in the format you choose.

<p align="center">
  <img src="https://raw.githubusercontent.com/IgorGRibeiro/directus-extension-phone-input/master/images/interface-example.jpeg" alt="Interface Example">
</p>

## Features

- Country selector with localized country names and dial codes
- As-you-type formatting powered by `libphonenumber-js`
- Configurable storage format: E.164 or digits only
- Optional validation with inline error message
- Prevents input past the country's maximum length
- Matching display component with four output formats (International, E.164, National, Digits)
- Sandboxed extension — no extra Directus permissions required

## Translations

Extension options in the collection editor are always displayed in **English**.

User-facing elements shown in the Data Studio during data entry (such as the "Invalid phone number." validation message) are automatically translated into all languages supported by Directus. Translations are machine-generated — if you notice anything incorrect or unnatural in your language, contributions are welcome! Open a pull request on [GitHub](https://github.com/IgorGRibeiro/directus-extension-phone-input) with the corrected strings in `src/i18n/<locale>.json`.

## Installation

### Via Directus Marketplace (Recommended)

1. Navigate to your Directus project
2. Go to **Settings** → **Extensions**
3. Search for "**Phone Input**"
4. Click **Install**

### Via npm

```bash
npm install @ribertec/directus-extension-phone-input
```

Then restart your Directus instance.

## Setup

This bundle provides one interface and one display.

### Phone interface (`phone-input`)

<p align="center">
  <img src="https://raw.githubusercontent.com/IgorGRibeiro/directus-extension-phone-input/master/images/interface-example.jpeg" alt="Interface Example">
</p>

Use on any `string` field where a phone number should be captured.

| Option                | Description                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Default country       | Country used to parse input when no selector is shown, or as the initial selection. Required when the selector is hidden. |
| Show country selector | Renders the country dropdown next to the input. Disable to lock the field to a single country.                            |
| Format as you type    | Applies `libphonenumber-js` as-you-type formatting while the user types.                                                  |
| Storage format        | How the value is persisted: `E.164` (e.g. `+12133734253`) or `Digits only` (e.g. `12133734253`).                          |
| Validate number       | When enabled, shows an inline error after the field is blurred if the number is not valid for the country.                |

<p align="center">
  <img src="https://raw.githubusercontent.com/IgorGRibeiro/directus-extension-phone-input/master/images/interface-options.jpeg" alt="Interface Options">
</p>

### Phone display (`phone-display`)

<p align="center">
  <img src="https://raw.githubusercontent.com/IgorGRibeiro/directus-extension-phone-input/master/images/display-example.jpeg" alt="Display Example">
</p>

Renders a stored phone value in read-only contexts (listings, detail pages, relational previews).

| Option          | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| Default country | Country used to parse stored values that are not already in international format. |
| Display format  | Output format: `International`, `E.164`, `National`, or `Digits only`.            |

<p align="center">
  <img src="https://raw.githubusercontent.com/IgorGRibeiro/directus-extension-phone-input/master/images/display-options.jpeg" alt="Display Options">
</p>

## Requirements

- Directus 11.0.0+

## License

MIT License — see [LICENSE](LICENSE) file for details

const fs = require('fs');
const path = require('path');

// 1. Add Javanese to language switcher in all translation files
console.log('Updating language switchers...');
const locales = ['en', 'id', 'ru', 'tr'];
locales.forEach(lang => {
  const filePath = `/app/src/locales/${lang}/translations.json`;
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data.components && data.components['language-switcher']) {
      data.components['language-switcher']['jv'] = 'Basa Jawa';
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  Updated ${lang}/translations.json`);
    }
  }
});

// 2. Add new navigation keys to English translations
console.log('Adding navigation keys...');
const enPath = '/app/src/locales/en/translations.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
if (enData.common && enData.common.navigation) {
  Object.assign(enData.common.navigation, {
    'other-explorers': 'Other Explorers',
    'community': 'Community',
    'ergexplorer': 'ErgExplorer',
    'sigmaspace': 'Sigmaspace',
    'sigmaexplorer': 'SigmaExplorer',
    'sigmanauts': 'Sigmanauts',
    'sigmanauts-mining': 'Sigmanauts Mining',
    'sigmaverse': 'Sigmaverse'
  });
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
  console.log('  Updated en/translations.json with navigation keys');
}

// 3. Register Javanese language in app.tsx
console.log('Registering Javanese language in app.tsx...');
const appPath = '/app/src/app.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// Add import for jv locale data (after tr import)
if (!appContent.includes("import jv from 'react-intl/locale-data/jv'")) {
  appContent = appContent.replace(
    "import tr from 'react-intl/locale-data/tr';",
    "import tr from 'react-intl/locale-data/tr';\nimport jv from 'react-intl/locale-data/jv';"
  );
}

// Add 'jv' to languages array
appContent = appContent.replace(
  "const languages = ['en', 'ru', 'id', 'tr'];",
  "const languages = ['en', 'ru', 'id', 'tr', 'jv'];"
);

// Add jv to addLocaleData call
appContent = appContent.replace(
  "addLocaleData([...en, ...ru, ...id, ...tr]);",
  "addLocaleData([...en, ...ru, ...id, ...tr, ...jv]);"
);

fs.writeFileSync(appPath, appContent);
console.log('  Updated app.tsx with Javanese language registration');

// 4. Add new dropdowns to navbar-menu component
console.log('Adding Other Explorers and Community dropdowns...');
const navbarPath = '/app/src/components/navbar-menu/navbar-menu.component.tsx';
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// The new dropdowns HTML
const otherExplorersDropdown = `
          <li className="bi-nav-dropdown">
            <a className="bi-nav-dropdown__link g-flex" href="#">
              <FormattedMessage id={'common.navigation.other-explorers'} />
              <ChevronDownIcon className="bi-nav-dropdown__icon" />
            </a>
            <ul className="bi-nav-dropdown__list">
              <li className="bi-nav-dropdown__item">
                <a href="https://ergexplorer.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />
                  <FormattedMessage id={'common.navigation.ergexplorer'} />
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />
                </a>
              </li>
              <li className="bi-nav-dropdown__item">
                <a href="https://sigmaspace.io/" target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />
                  <FormattedMessage id={'common.navigation.sigmaspace'} />
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />
                </a>
              </li>
              <li className="bi-nav-dropdown__item">
                <a href="https://sigmaexplorer.org/" target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />
                  <FormattedMessage id={'common.navigation.sigmaexplorer'} />
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />
                </a>
              </li>
            </ul>
          </li>`;

const communityDropdown = `
          <li className="bi-nav-dropdown">
            <a className="bi-nav-dropdown__link g-flex" href="#">
              <FormattedMessage id={'common.navigation.community'} />
              <ChevronDownIcon className="bi-nav-dropdown__icon" />
            </a>
            <ul className="bi-nav-dropdown__list">
              <li className="bi-nav-dropdown__item">
                <a href="https://sigmanauts.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />
                  <FormattedMessage id={'common.navigation.sigmanauts'} />
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />
                </a>
              </li>
              <li className="bi-nav-dropdown__item">
                <a href="https://sigmanauts.com/mining" target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />
                  <FormattedMessage id={'common.navigation.sigmanauts-mining'} />
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />
                </a>
              </li>
              <li className="bi-nav-dropdown__item">
                <a href="https://sigmaverse.io/" target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />
                  <FormattedMessage id={'common.navigation.sigmaverse'} />
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />
                </a>
              </li>
            </ul>
          </li>`;

// Find the "More" dropdown and insert before it
// The More dropdown starts with: <li className="bi-nav-dropdown"> followed by common.navigation.more
const moreDropdownPattern = /(\s*)(<li className="bi-nav-dropdown">\s*<a className="bi-nav-dropdown__link g-flex" href="#">\s*<FormattedMessage id=\{'common\.navigation\.more'\})/;

if (moreDropdownPattern.test(navbarContent)) {
  navbarContent = navbarContent.replace(
    moreDropdownPattern,
    `$1${otherExplorersDropdown}$1${communityDropdown}$1$2`
  );
  fs.writeFileSync(navbarPath, navbarContent);
  console.log('  Updated navbar-menu.component.tsx');
} else {
  console.error('  ERROR: Could not find More dropdown pattern in navbar');
  process.exit(1);
}

console.log('All patches applied successfully!');

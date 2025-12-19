#!/bin/bash
# Apply custom patches to the explorer-frontend
# This script is run during Docker build after the frontend source is downloaded

set -e

echo "Applying custom patches..."

# 1. Copy Javanese translations (PR #198)
echo "Adding Javanese language support..."
mkdir -p /app/src/locales/jv
cp /patches/jv/translations.json /app/src/locales/jv/

# 2. Add Javanese to language switcher in all translation files
echo "Updating language switchers..."
for lang in en id ru tr; do
    if [ -f "/app/src/locales/$lang/translations.json" ]; then
        # Add "jv": "Basa Jawa" after "tr": "Türkçe" in language-switcher
        sed -i 's/"tr": "Türkçe"/"tr": "Türkçe",\n      "jv": "Basa Jawa"/g' "/app/src/locales/$lang/translations.json"
    fi
done

# 3. Add new navigation keys to English translations
echo "Adding navigation keys for new dropdowns..."
sed -i 's/"ergo-watch": "Ergo Watch"/"ergo-watch": "Ergo Watch",\n      "other-explorers": "Other Explorers",\n      "community": "Community",\n      "ergexplorer": "ErgExplorer",\n      "sigmaspace": "Sigmaspace",\n      "sigmaexplorer": "SigmaExplorer",\n      "sigmanauts": "Sigmanauts",\n      "sigmanauts-mining": "Sigmanauts Mining",\n      "sigmaverse": "Sigmaverse"/g' /app/src/locales/en/translations.json

# 4. Add new dropdowns to navbar-menu component
echo "Adding Other Explorers and Community dropdowns..."
NAVBAR_FILE="/app/src/components/navbar-menu/navbar-menu.component.tsx"

# Insert the new dropdowns before the "More" dropdown
# Find the line with 'common.navigation.more' and insert before it
sed -i '/<FormattedMessage id={'"'"'common.navigation.more'"'"'}/i\
          <li className="bi-nav-dropdown">\
            <a className="bi-nav-dropdown__link g-flex" href="#">\
              <FormattedMessage id={'"'"'common.navigation.other-explorers'"'"'} />\
              <ChevronDownIcon className="bi-nav-dropdown__icon" />\
            </a>\
            <ul className="bi-nav-dropdown__list">\
              <li className="bi-nav-dropdown__item">\
                <a href="https://ergexplorer.com/" target="_blank" rel="noopener noreferrer">\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />\
                  <FormattedMessage id={'"'"'common.navigation.ergexplorer'"'"'} />\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />\
                </a>\
              </li>\
              <li className="bi-nav-dropdown__item">\
                <a href="https://sigmaspace.io/" target="_blank" rel="noopener noreferrer">\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />\
                  <FormattedMessage id={'"'"'common.navigation.sigmaspace'"'"'} />\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />\
                </a>\
              </li>\
              <li className="bi-nav-dropdown__item">\
                <a href="https://sigmaexplorer.org/" target="_blank" rel="noopener noreferrer">\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />\
                  <FormattedMessage id={'"'"'common.navigation.sigmaexplorer'"'"'} />\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />\
                </a>\
              </li>\
            </ul>\
          </li>\
          <li className="bi-nav-dropdown">\
            <a className="bi-nav-dropdown__link g-flex" href="#">\
              <FormattedMessage id={'"'"'common.navigation.community'"'"'} />\
              <ChevronDownIcon className="bi-nav-dropdown__icon" />\
            </a>\
            <ul className="bi-nav-dropdown__list">\
              <li className="bi-nav-dropdown__item">\
                <a href="https://sigmanauts.com" target="_blank" rel="noopener noreferrer">\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />\
                  <FormattedMessage id={'"'"'common.navigation.sigmanauts'"'"'} />\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />\
                </a>\
              </li>\
              <li className="bi-nav-dropdown__item">\
                <a href="https://sigmanauts.com/mining" target="_blank" rel="noopener noreferrer">\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />\
                  <FormattedMessage id={'"'"'common.navigation.sigmanauts-mining'"'"'} />\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />\
                </a>\
              </li>\
              <li className="bi-nav-dropdown__item">\
                <a href="https://sigmaverse.io/" target="_blank" rel="noopener noreferrer">\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--item" />\
                  <FormattedMessage id={'"'"'common.navigation.sigmaverse'"'"'} />\
                  <ExternalLinkIcon className="bi-nav-dropdown__icon bi-nav-dropdown__icon--external" />\
                </a>\
              </li>\
            </ul>\
          </li>' "$NAVBAR_FILE"

echo "Patches applied successfully!"

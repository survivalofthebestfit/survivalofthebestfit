set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  echo 'Please merge with master and push before deploying github pages. You can push only from master branch.';
  exit 1;
fi

read -p "Did you test your changes? Are you sure you want to push? [y/n]" -n 1 -r
echo    
if [[ $REPLY =~ ^[Yy]$ ]]
then
    if ! grep -Fq "debugMode = false"  game-source/public/game/controllers/game/mlLabNarrator.js
    then
        echo "Can't find 'debugMode = false' in mlLabNarrator. Pls set debugMode to false."
        exit 1
    fi

    if ! grep -q "^\s*this.transition('titleStage');"  game-source/public/game/controllers/game/stateManager.js
    then
        echo "The stateManager doesn't seem to be set to titleStage. Please fix it."
        exit 1
    fi

    echo "Rebuilding project"
    cd website-source
    npm run build
    cd ../game-source
    npm run build
    cd ..
    git add ./dist
    git status 
    read -p "Are you happy with the changelist? [y/n]" -n 1 -r
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        git commit -m "gh pages release"
        git subtree split --prefix dist -b gh-pages
        git push -f origin gh-pages:gh-pages
    else
        echo "Aborting and Resetting stage."
        git reset
    fi
fi
echo "Done. Make sure live page still works!"
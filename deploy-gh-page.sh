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
    read -p "Is the state manager's stransition stage set to title? [y/n]" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
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
fi
echo "Done. Make sure live page still works!"
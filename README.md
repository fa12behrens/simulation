This project use the angular-seed project as start up and is based on the angularjs framework.

Our whole code is included in the app folder,
devided by several folders:

- css / contains the css files
- img / contains jpeg and png files
- json / contains json files
- js / contains scripte(js) files
- partials / contains html files
- php / contains php files
- index.html / no folder ...

I think this is self-explanatory,
but the app folder isn't our only folder,
we need also complementary folders and files,
to keep the project running:

- bower_components / contains frameworks and libraries
- node_modules and test / folders for our unit tests and our point to point testing, not sure if we use this.
- sql_schema / contains our sql files
- documentation / contains project and software documentation
- old / contains old js files, removed soon
- and above some npm/node files

Now we know what is in here,
next step is to deal and work with it.

At first you will need to download this from git
into your local file system:

This following text describe how u can use git (ignore if u know git!).

You already joined git and our repository, otherwise you won't read this.

How to use the website: You are already on the main page of git,
so i am starting from here. Over this Readme.md should be a block which shows all project content,
if u looked at this you can see folder names, the last commit message and the date of the last commit.
You can navigate through this while click the folder,
for step into the folder or click the commit message to view the last commit.
Above you can see the last commit and his author. Above this you can see a navigation with commits,
branches, releases and contributors + number. Above this you have your personal bar, with path,search,logout etc..
At the right side u can see some links and download stuff.
Links are just a few usefull like issues for bugtracking etc.,
pull request if you want to move your branch back into the master and the Wiki,
the wiki should contain the software_doku and more, but today it's empty.

How to clone it on my PC: Before you see the download stuff, but if you don't know how to use,
just copy the HTTPS url (should be https://github.com/fa12behrens/wg_project.git or some similar) from the textfield.
If you don't install git before, you should do it now! (http://git-scm.com/downloads) If you are done,
you can use 3 ways to clone stuff

use git gui->clone project and paste the url into source, also enter ure target directory
use git bash->navigate to the target path and enter (git clone url)->(git clone https://github.com/fa12behrens/wg_project.git)
use your IDE to clone from VCS GIT, the process is similar to git gui but it's direct in your IDE,
if it is. Now you have your repository local, but you can't even update or commit it,
to fix it u need to open git bash->navigate to your project and enter (git branch --set-upstream master origin/master)or
(git branch --set-upstream-to origin/master)is newer Oh, wait u can't navigate in git bash? Damn,
its with (cd /drive/folder/folder/) as example (cd /d/projects/wg_project) like unix. So now you can work with the code.

Now you got it.

I try to explain it very well but if you have open questions you can look at angularjs api for more information.
-> https://docs.angularjs.org/api

As you can see, there is an .exe file in our project,
this is our manager for server and bower emulation.

To use it you must step into your own project folder with git bash
and do npm install to install new bower components etc. or start to start the server.

Because these server don't work with php, we use xampp apache for it,
also we can use phpmyadmin / mysql with this.

To control which components should be installed,
you can edit the bower.json:

 "dependencies": {
 //contains frameworks and libraries like bootstrap or angularjs
 	"angular": "1.2.x",
 	"angular-route": "1.2.x",
 	"angular-loader": "1.2.x",
 	"angular-mocks": "~1.2.15",
 	"angular-animate": "~1.2.15",
 	"angular-resource": "~1.2.15",
 	"jquery": "1.10.2",
 	"jquery-ui": "~1.10.3",
 	"bootstrap": "~3.1.1"
 // our current components as example
 }

 Now you can add components and run the server.

 I skip the other folders and jump directly to the app folder.

 Css, img and json are clear!?

 Php is used as interface between database/files and javascript,
 each php file is listening to post requests and save the return value
 into a json file or return it to the js file which called it.

 Partials are html files which includes parts of the whole site,
 it is showing up in the index.html with help from angular.

 The index.html contains the main parts from html and includes all
 external files.

 Attention: you can use the angular framework,
 to do stuff in html directly.
1.
 ng-"one of many attributes" in or as an html tag like:
 <input type="submit" ... ng-click="myScopeFunction()">
 this example run a function which is declared in js and saved into a scope object.
2.
 Logical operations can be done in {{"here"}} like:
 {{3 + 4}}
 {{myScopeVariable}}

 For more informations, pls watch the angular api i noticed before
 or search the angular site
 -> https://angularjs.org/
 if the api don't help you, there are two options you can search there,
 develop or learn, if you step into it you maybe find what you need.

 At least JS,
 we have app.js here, it appears in our index, like app.css and is the core js file.
 Here we create or BOSS module called simulationApp, which must be included in the index.
 We say which other js parts should been added and can manage routing
 and other stuff in simulationApp.config.

 The controller can use scopes, interface from html to js and is the big brother
 from service, both are designed to perform complex actions that should not be directly in the app.
 Controllers use services like a function use an abstract function to avoid double code and long files.

 Directives can be used to implement jquery functions or similar
 into our app, notice is use angular style and you can't just use the jquery syntax.
 Css use angular style to but normal css still working so, yeah :D,
 use what you want.

 Filters can filter the information which should be shown,
 simple filters can be build without it directly into html files.

 This was our readme, for more questions send us, or me a message.


/* **************************************************************

   Copyright 2011 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

/*
An extension for acquiring and displaying 'lists' of categories.
The functions here are designed to work with 'reasonable' size lists of categories.
*/


var simple_sample = function() {
	var r = {
		
	vars : {
//a list of the templates used by this extension.
//if this is a custom extension and you are loading system extensions (prodlist, etc), then load ALL templates you'll need here.
		"templates" : ['productTemplate','categoryTemplate','mpControlSpec']
		},




					////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		



	calls : {

		someDescriptiveName : {
//the init is used to do any pre-processing. for instance, check if data is already in memory or local and if so, just execute the callback.
			init : function(tagObj)	{
/*
do a fetch here to see if data is already local.
myControl.model.fetchData(datapointer) will return true of false depending on whether or not the data is or is not in memory, respectively. 
if the data is in memory, it's likely from this user session (recent).
If the data is in localStorage, the fetch will check a timestamp to make sure the data isn't too old (24 hours).
*/
				if(myControl.model.fetchData(tagObj.datapointer)){
//go straight to executing the callback because the data is already available.
//if extension is defined in the tagobj, then a callback within that extension will be executed.
//the extension passed should be for where the callback function is located, not the extension that ran the call.
					if(tagObj.callback)	{
						tagObj.extension ? myControl.extensions[tagObj.extension].callbacks[tagObj.callback].onSuccess(tagObj) : myControl.callbacks[tagObj.callback].onSuccess(tagObj);
						}
					else	{
//this is a handy reporting tool. it'll throw to the console whatever is present, including objects. objects not supported in IE console.
						myControl.util.dump(" -> data for request was local but no callback defined.");
						}
					}
				else	{
//execute the dispatch. (go get the data from the api).
					this.dispatch(tagObj);
					}
				},
//this is used to formulate the dispatch and add it to the q.
//put your command do dispatch OUTSIDE this. That way you can q up multiple requests and send them all at once.
//if the dq is empty and you dispatch it, that's fine.
			dispatch : function(tagObj)	{
				obj = {};
				obj['_cmd'] = "categoryTree";
				obj['_tag'].extension = 'simple_sample';
				myControl.model.addDispatchToQ(obj);
				}
			}
		}, //calls




					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\





	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
//				myControl.util.dump('BEGIN myControl.extensions.store_navcats.init.onSuccess ');
				var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).
				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				myControl.util.dump('BEGIN myControl.extensions.store_navcats.callbacks.init.onError');
				}
			},



//in addition to the 'init', you can also specify another callback to execute once the extension is done loading.
//this will only load if the extension successfully loads (init returns a true).

		startMyProgram : {
			onSuccess : function()	{
//				myControl.util.dump('BEGIN myControl.extensions.simple_sample.callbacks.startMyProgram.onSuccess');
//go get the root level categories, then show them using showCategories callback.
				myControl.extensions.store_navcats.calls.categoryTree.init({"callback":"showCategories","extension":"simple_sample"}); 
				myControl.model.dispatchThis();
				},
			onError : function()	{
				$('#globalMessaging').append(myControl.util.getResponseErrors(d)).toggle(true);
				}
			},
		showCategories : {
			onSuccess : function()	{
//				myControl.util.dump('BEGIN myControl.extensions.simple_sample.callbacks.showCategories.onSuccess');
				myControl.extensions.store_navcats.util.getChildDataOf('.',{'parentID':'leftCol','callback':'addCatToDom','templateID':'categoryTemplate','extension':'store_navcats'},'categoryDetail');
				myControl.model.dispatchThis();
				},
			onError : function()	{
//throw some messaging at the user.  since the categories should have appeared in the left col, that's where we'll add the messaging.
				$('#leftCol').append(myControl.util.getResponseErrors(d)).toggle(true);
				}
			}
		
		}, //callbacks







////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\





		renderFormats : {
			
			
			
			},


////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		util : {

			
			}


		
		} //r object.
	return r;
	}
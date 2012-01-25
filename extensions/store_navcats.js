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


var store_navcats = function() {
	var r = {
	vars : {
		"templates" : [] //here for testing. remove prior to deployment. !!!
		},

					////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		



	calls : {

		categoryTree : {
			init : function(tagObj)	{
				if(myControl.model.fetchData('categoryTree') == false)	{
					this.dispatch(tagObj);
					}
				else	{
					tagObj.extension ? myControl.extensions[tagObj.extension].callbacks[tagObj.callback].onSuccess(tagObj) : myControl.callbacks[tagObj.callback].onSuccess(tagObj)
					}
				},
			dispatch : function(tagObj)	{
				obj = {};
				obj['_cmd'] = "categoryTree";
				obj['_tag'] = typeof tagObj == 'object' ? tagObj : {};
				obj['_tag'].datapointer = 'categoryTree'; //for now, override datapointer for consistency's sake.
//if no extension is set, use this one. need to b able to override so that a callback from outside the extension can be added.
				obj['_tag'].extension = obj['_tag'].extension ? obj['_tag'].extension : 'store_navcats'; 
				myControl.model.addDispatchToQ(obj);
				}
			}, //categoryTree

		categoryDetail : {
			init : function(catSafeID,tagObj)	{
				

				
//				myControl.util.dump('BEGIN myControl.extensions.store_navcats.calls.categoryDetail.init');
				var r = 0; //will return a 1 if data is in localStorage
				tagObj = typeof tagObj !== 'object' ? {} : tagObj;
//whether max, more or just detail, always save to same loc.
//add here so if tagObj is passed directly into callback because data is in localStorage, the datapointer is set.
				tagObj.datapointer = 'categoryDetail|'+catSafeID;

//uncomment these lines to force a dispatch. (for testing)
//				this.dispatch(catSafeID,tagObj); 
//				return true; 				
				
				
				if(myControl.model.fetchData(tagObj.datapointer) == false)	{
					this.dispatch(catSafeID,tagObj);
					}
				else if(tagObj && tagObj.callback){
					r += 1;
					tagObj.extension ? myControl.extensions[tagObj.extension].callbacks[tagObj.callback].onSuccess(tagObj) : myControl.callbacks[tagObj.callback].onSuccess(tagObj)
					}
				else	{
					r = 1;
//					myControl.util.dump(" -> data is in memory and/or local storage. no callback defined. Odd.")
					}
				return r;
				},
			dispatch : function(catSafeID,tagObj)	{
				var catSafeID;
//				myControl.util.dump(' -> safeid = '+catSafeID);
//				myControl.util.dump(' -> executing dispatch.');
				myControl.model.addDispatchToQ({"_cmd":"categoryDetail","safe":catSafeID,"detail":"fast","_tag" : tagObj});	
				}
			},//categoryDetail

		categoryDetailMore : {
			init : function(catSafeID,tagObj)	{
//				myControl.util.dump('BEGIN myControl.extensions.store_navcats.calls.categoryDetailMore.init');
				var r = 0; //will return a 1 if data is in localStorage
				tagObj = typeof tagObj !== 'object' ? {} : tagObj;
//whether max, more or just detail, always save to same loc.
//add here so if tagObj is passed directly into callback because data is in localStorage, the datapointer is set.
				tagObj.datapointer = 'categoryDetail|'+catSafeID;
				if(myControl.model.fetchData(tagObj.datapointer) == false)	{
					this.dispatch(catSafeID,tagObj);
					}
				else	{
//a 'more' request for categoryDetail will return subcategoryCount. 
//So if these it is undefined, what was retrieved from local was likely a 'fast' dataset and a request needs to be made.
					if(typeof myControl.data[tagObj.datapointer].subcategoryCount === 'undefined')	{
						this.dispatch(catSafeID,tagObj);
						}
					else if(tagObj && tagObj.callback){
						r += 1;
						tagObj.extension ? myControl.extensions[tagObj.extension].callbacks[tagObj.callback].onSuccess(tagObj) : myControl.callbacks[tagObj.callback].onSuccess(tagObj)
						}
					else	{
						r = 1;
	//					myControl.util.dump(" -> data is in memory and/or local storage. no callback defined. Odd.")
						}
					}
				return r;
				},
			dispatch : function(catSafeID,tagObj)	{
				var catSafeID;
				tagObj.datapointer = 'categoryDetail|'+catSafeID; //whether max, more or just detail, always save to same loc.
				myControl.model.addDispatchToQ({"_cmd":"categoryDetail","safe":catSafeID,"detail":"more","_tag" : tagObj});	
				}
			},//categoryDetailMore

		categoryDetailMax : {
			init : function(catSafeID,tagObj)	{
//				myControl.util.dump('BEGIN myControl.extensions.store_navcats.calls.categoryDetailMax.init');
				var r = 0; //will return a 1 if data is in localStorage
				tagObj = typeof tagObj !== 'object' ? {} : tagObj;
//whether max, more or just detail, always save to same loc.
//add here so if tagObj is passed directly into callback because data is in localStorage, the datapointer is set.
				tagObj.datapointer = 'categoryDetail|'+catSafeID;
//				myControl.util.dump(' -> datapointer = '+tagObj.datapointer);
				
				if(myControl.model.fetchData(tagObj.datapointer) == false)	{
//					myControl.util.dump(' -> data is not local. go get it.');
					this.dispatch(catSafeID,tagObj);
					}
				else	{
//					myControl.util.dump(' -> data is local. use it.');
//a 'max' request for categoryDetail will return an object in subcategoryDetail. 
//So if this node does not exist or is not an object, what was in local was either a fast or more dataset and a request needs to be made.
					if(typeof myControl.data[tagObj.datapointer]['@subcategoryDetail'] === 'undefined' || typeof myControl.data[tagObj.datapointer]['@subcategoryDetail'][0] !== 'object')	{
						this.dispatch(catSafeID,tagObj);
						}
					else if(tagObj && tagObj.callback){
						r += 1;
						tagObj.extension ? myControl.extensions[tagObj.extension].callbacks[tagObj.callback].onSuccess(tagObj) : myControl.callbacks[tagObj.callback].onSuccess(tagObj)
						}
					else	{
						r = 1;
	//					myControl.util.dump(" -> data is in memory and/or local storage. no callback defined. Odd.")
						}
					}
				return r;
				},
			dispatch : function(catSafeID,tagObj)	{
//				myControl.util.dump(' -> safeid = '+catSafeID);
//				myControl.util.dump(' -> executing dispatch.');
				myControl.model.addDispatchToQ({"_cmd":"categoryDetail","safe":catSafeID,"detail":"max","_tag" : tagObj});	
				}
			}//categoryDetailMax

		}, //calls









					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\









	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration.
		init : {
			onSuccess : function()	{
//				myControl.util.dump('BEGIN myControl.extensions.store_navcats.init.onSuccess ');
				return true;  //currently, no system or config requirements to use this extension
//				myControl.util.dump('END myControl.extensions.store_navcats.init.onSuccess');
				},
			onError : function()	{
				myControl.util.dump('BEGIN myControl.extensions.store_navcats.callbacks.init.onError');
				}
			},

		getRootCatsData : {
			onSuccess : function(tagObj)	{
//				myControl.util.dump("BEGIN myControl.extensions.store_navcats.callbacks.handleProduct.onSuccess");
				myControl.extensions.store_navcats.util.getRootCatsData(tagObj);
				},
			onError : function(d)	{
				$('#globalMessaging').append(myControl.util.getResponseErrors(d)).toggle(true);
				}
			},
/*
cats that start with a ! in the 'pretty' name are 'hidden'.  However, the pretty name isn't available until categoryDetail is request.
categoryDetail is requested AFTER a DOM element is already created for each category in the specified tree.  This is necessary because some data is loaded from local storage (fast)
and some has to be requested (not as fast). To maintain the correct order, the DOM element is added, then populated as info becomes available.
in this case, the DOM element may not be necessary, and in those cases (hidden cat), it is removed.

params in addition to standard tagObj (datapointer, callback, etc).

templateID - the template id used (from myControl.templates)
*/
		addCatToDom : {
			onSuccess : function(tagObj)	{
//				myControl.util.dump("BEGIN myControl.extensions.store_navcats.callbacks.addCatToDom.onSuccess");
//				myControl.util.dump(" -> datapointer = "+tagObj.datapointer);
//				myControl.util.dump(" -> add data to template: "+tagObj.parentID+"_"+tagObj.datapointer.split('|')[1]);
				if(myControl.data[tagObj.datapointer].pretty.charAt(0) !== '!')	{
					myControl.renderFunctions.translateTemplate(myControl.data[tagObj.datapointer],tagObj.parentID+"_"+tagObj.datapointer.split('|')[1]);
					}
				else	{
					myControl.util.dump(" -> cat '"+myControl.data[tagObj.datapointer].pretty+"' is hidden. nuke it!");
					$('#'+myControl.util.makeSafeHTMLId(tagObj.parentID+"_"+tagObj.datapointer.split('|')[1])).empty().remove();
					}
				},
			onError : function(d)	{
				$('#globalMessaging').append(myControl.util.getResponseErrors(d)).toggle(true);
				}
			}
		}, //callbacks







////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\





		renderFormats : {},


////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		util : {
/*
In cases where the root categories are needed, this function will return them from the categoryTree dataset.
function assumes categoryTree already exists in memory.
will return an object of id:safeid, which is how the categories are stored in a categoryDetail.
the formatted is specific so that getChildDataOf can be used for a specific id or '.' so don't change the output without testing it in that function.
*/
			getRootCats : function()	{
				myControl.util.dump('BEGIN myControl.extensions.store_navcats.util.getRootCats');
				var L = myControl.data.categoryTree['@paths'].length;
				var r = new Array();
				myControl.util.dump(' -> num rootcats = '+L);
				for(var i = 0; i < L; i += 1)	{
					if(myControl.data.categoryTree['@paths'][i].split('.').length == 2)	{
						r.push({"id":myControl.data.categoryTree['@paths'][i]});
						}
					}
				return r;
				}, //getRootCatsData


/*
a function for obtaining information about a categories children.
assumes you have already retrieved data on parent so that @subcategories is present.
 -> catSafeID should be the category safe id that you want to obtain information for.
 -> call, in all likelyhood, will be set to one of the following:  categoryDetailMax, categoryDetailMore, categoryDetailFast.  It'll default to Fast.
tagObj is optional and would contain the standard params that can be set in the _tag param (callback, templateID, etc).
if the parentID and templateID are passed as part of tagObj, a template instance is created within parentID.
This function just creates the calls.  Dispatch on your own.
*/
			getChildDataOf : function(catSafeID,tagObj,call){
				myControl.util.dump("BEGIN myControl.extensions.store_navcats.util.getChildDataOf");
				myControl.util.dump(" -> catSafeID = "+catSafeID);
//if . is passed as catSafeID, then tier1 cats are desired. The list needs to be generated.
				var catsArray = catSafeID == '.' ? this.getRootCats() : myControl.data['categoryDetail|'+catSafeID]['@subcategoryDetail']
				var L = catsArray.length;
				var call = call ? call : "categoryDetailFast"
//				myControl.util.dump(" -> catSafeID = "+catSafeID);
//				myControl.util.dump(" -> call = "+call);
//				myControl.util.dump(" -> # subcats = "+L);
 //used in the for loop below to determine whether or not to render a template. use this instead of checking the two vars (templateID and parentID)
				renderTemplate = false;
				if(tagObj.templateID && tagObj.parentID)	{
					var $parent = $('#'+tagObj.parentID);
					var renderTemplate = true;
					}
	
				for(var i = 0; i < L; i += 1)	{
					if(renderTemplate)	{
						$parent.append(myControl.renderFunctions.createTemplateInstance(tagObj.templateID,{"id":tagObj.parentID+"_"+catsArray[i].id,"catsafeid":catsArray[i].id}));
						}
//if tagObj was passed in without .extend, the datapointer would end up being shared across all calls.
//I would have though that manipulating tagObj within another function would be local to that function. apparently not.
					myControl.extensions.store_navcats.calls[call].init(catsArray[i].id,$.extend({},tagObj));
					}
				
				} //getChildDataOf
			}


		
		} //r object.
	return r;
	}
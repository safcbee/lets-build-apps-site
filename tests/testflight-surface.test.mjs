import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import apps from '../support-api/src/testflight-apps.json' with {type:'json'};

const read=path=>readFileSync(`public/${path}`,'utf8');
test('every TestFlight app has a scoped request form entry point',()=>{
 const home=read('index.html'),form=read('testflight/index.html');
 const pages={sentences:'sentences','my-world':'my-world',countdowns:'countdowns','better-pictures':'better-pics','family-memories':'family-memories','better-coffee':'perfect-coffee','family-trips':'family-trips','travel-plans':'travel-plans','paw-care':'paw-care'};
 for(const key of Object.keys(apps).filter(key=>!apps[key].retired)){
  assert.ok(home.includes(`./testflight/?app=${key}`),`${key} homepage request link`);
  assert.ok(form.includes(`option value="${key}"`),`${key} can be selected`);
  if(pages[key])assert.ok(read(`${pages[key]}/index.html`).includes(`../testflight/?app=${key}`),`${key} product request link`);
 }
 assert.match(form, /name="topic" value="testflight"/);
 assert.match(form, /type="checkbox" name="consent" value="yes" required/);
 assert.match(form, /action="https:\/\/support\.letsbuildappshq\.com\/submit"/);
 assert.match(form, /privacy\/#testflight-requests/);
 assert.doesNotMatch(home+form,/testflight\.apple\.com\/join\//);
});

/// <reference path="../references.d.ts" />

import {bootstrap} from 'angular2/angular2';
import {routerInjectables} from 'angular2/router';
import {formInjectables} from 'common/formInjectables';

import {shadowDomInjectables} from 'common/shadowDomStrategy';

import {AppComponent} from 'app/components/app';
import {PlayerService} from 'app/api/playerService';
import {GameService} from 'app/api/gameService';

bootstrap(AppComponent, [
  PlayerService,
  GameService,
  routerInjectables,
  formInjectables,
  shadowDomInjectables
]);

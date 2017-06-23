import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Angular Material
import { MaterialModule,
         MdIconModule,
         MdIconRegistry, 
         MdDatepickerModule,
         MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // md-tab
import 'hammerjs';

// Firebase
import { AngularFireModule         } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule     } from 'angularfire2/auth';
import { environment               } from '../environments/environment';


////////////////////////////////////////////////////////////////////////////////////////////////////
// MyServices
import { MyUtilitiesService } from './my-utilities.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

// MyComponents
import { AppComponent  } from './app.component';
import { HomeComponent } from './home/home.component';

// MyDataTable
import { MyDataTableComponent  } from './my-data-table/my-data-table.component';
import { ItemsPerPageComponent } from './my-data-table/items-per-page/items-per-page.component';
import { PagenationComponent   } from './my-data-table/pagenation/pagenation.component';
import { ResetButtonComponent  } from './my-data-table/reset-button/reset-button.component';

import { MyWaitingSpinnerComponent } from './my-waiting-spinner/my-waiting-spinner.component';
import { AppListComponent          } from './app-list/app-list.component';

// Dominion Apps
import { DominionComponent               } from './dominion/dominion.component';
import { CardPropertyDialogComponent     } from './dominion/card-property-dialog/card-property-dialog.component';
import { CardPropertyListComponent       } from './dominion/card-property-list/card-property-list.component';
import { DominionCardImageComponent      } from './dominion/dominion-card-image/dominion-card-image.component';
import { GameResultComponent             } from './dominion/game-result/game-result.component';
import { PlayersComponent                } from './dominion/players/players.component';
import { RandomizerComponent             } from './dominion/randomizer/randomizer.component';
import { RuleBooksComponent              } from './dominion/rule-books/rule-books.component';
import { SubmitGameResultDialogComponent } from './dominion/submit-game-result-dialog/submit-game-result-dialog.component';
import { GameResultListComponent         } from './dominion/game-result/game-result-list/game-result-list.component';
import { GameResultOfPlayerComponent     } from './dominion/game-result/game-result-of-player/game-result-of-player.component';
import { AddGameResultComponent          } from './dominion/randomizer/add-game-result/add-game-result.component';
import { RandomizerCardImageComponent    } from './dominion/randomizer/randomizer-card-image/randomizer-card-image.component';
import { RandomizerSelectCardsComponent  } from './dominion/randomizer/randomizer-select-cards/randomizer-select-cards.component';
import { SyncGroupsComponent             } from './dominion/randomizer/sync-groups/sync-groups.component';
import { BlackMarketPileComponent        } from './dominion/randomizer/black-market-pile/black-market-pile.component';
import { ScoringTableComponent           } from './dominion/scoring-table/scoring-table.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { LoginComponent } from './user-admin/login/login.component';
import { SignUpComponent } from './user-admin/sign-up/sign-up.component';


////////////////////////////////////////////////////////////////////////////////////////////////////


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyDataTableComponent,
    MyWaitingSpinnerComponent,
    ItemsPerPageComponent,
    PagenationComponent,
    ResetButtonComponent,
    AppListComponent,
    DominionComponent,
    CardPropertyDialogComponent,
    CardPropertyListComponent,
    DominionCardImageComponent,
    GameResultComponent,
    SubmitGameResultDialogComponent,
    GameResultListComponent,
    GameResultOfPlayerComponent,
    PlayersComponent,
    RandomizerComponent,
    AddGameResultComponent,
    RandomizerCardImageComponent,
    RuleBooksComponent,
    ConfirmDialogComponent,
    RandomizerSelectCardsComponent,
    SyncGroupsComponent,
    BlackMarketPileComponent,
    ScoringTableComponent,
    UserAdminComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule.forRoot( [
      { path: ''                    , component: HomeComponent               },
      { path: 'dominion'            , component: DominionComponent           },
      { path: 'dominion/cardlist'   , component: CardPropertyListComponent   },
      { path: 'dominion/rulebooks'  , component: RuleBooksComponent          },
      { path: 'dominion/randomizer' , component: RandomizerComponent         },
      { path: 'dominion/gameresult' , component: GameResultComponent         },
      { path: 'dominion/players'    , component: PlayersComponent            },
      { path: 'dominion/scoring'    , component: ScoringTableComponent       },
      { path: 'user_admin'          , component: UserAdminComponent          }
    ], { useHash: true } ),
    MaterialModule,
    MdDatepickerModule,
    MdNativeDateModule,
    AngularFireModule.initializeApp(environment.firebase, 'DominionApps'), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [
    { provide: 'DATA_DIR', useValue: 'assets' },
    { provide: 'DOMINION_DATA_DIR', useValue: 'assets' },
    { provide: 'HOST_NAME', useValue: 'http://dominion.piko-apps.info/' },
    { provide: 'FIREBASE_DATA_URL', useValue: 'https://dominionapps.firebaseio.com/data' },
    MyUtilitiesService,
  ],
  /* for dialog, snackbar */
  entryComponents: [
      CardPropertyDialogComponent,
      SubmitGameResultDialogComponent,
      ConfirmDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

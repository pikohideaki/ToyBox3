export class UserInfo {
  databaseKey: string;
  id: string;
  name: string;

  dominionGroupID: string;
  settings: any = {};

  // randomizerGroupID
    // reset at mypage

  constructor( userInfoObj? ) {
    if ( userInfoObj === undefined ) return;
    this.databaseKey     = userInfoObj.databaseKey;
    this.id              = userInfoObj.id;
    this.name            = userInfoObj.name;
    this.dominionGroupID = userInfoObj.dominionGroupID;
    if ( userInfoObj.settings ) {
      this.settings = userInfoObj.settings;
    }
  }
}

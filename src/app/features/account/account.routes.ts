import { Routes } from '@angular/router';
import { AccountLayoutComponent } from './layout/account-layout/account-layout.component';
import { ProfileTabComponent } from './pages/profile-tab/profile-tab.component';
import { LibraryTabComponent } from './pages/library-tab/library-tab.component';
import { HistoryTabComponent } from './pages/history-tab/history-tab.component';
import { CommentsTabComponent } from './pages/comments-tab/comments-tab.component';
import { ReviewsTabComponent } from './pages/reviews-tab/reviews-tab.component';
import { InboxTabComponent } from './pages/inbox-tab/inbox-tab.component';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountLayoutComponent,
    children: [
      {
        path: 'profile',
        component: ProfileTabComponent,
      },
      {
        path: 'library',
        component: LibraryTabComponent,
      },
      {
        path: 'history',
        component: HistoryTabComponent,
      },
      {
        path: 'comments',
        component: CommentsTabComponent,
      },
      {
        path: 'reviews',
        component: ReviewsTabComponent,
      },
      {
        path: 'inbox',
        component: InboxTabComponent,
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
    ],
  },
];

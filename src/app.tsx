/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable import/first, import/imports-first */

/* eslint-disable-next-line import/no-unresolved */
import { customElement, GlobalProps } from 'ojs/ojvcomponent';
/* eslint-disable-next-line no-unused-vars */
import { h, Component, ComponentChild } from 'preact';
import { Router } from 'preact-router';
import Context = require('ojs/ojcontext');

import TopicsListPage from './pages/TopicsListPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

@customElement('app-root')
export default class App extends Component<GlobalProps> {
  render(): ComponentChild {
    return (
      <Router>
        <TopicsListPage path={`${process.env.BASE_URL}/`} />
        <ArticleDetailsPage path={`${process.env.BASE_URL}/article/:articleId`} />
        <NotFoundPage default />
      </Router>
    );
  }

  componentDidMount() {
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  }
}

/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable import/no-unresolved */

/* eslint-disable-next-line no-unused-vars */
import { Component, ComponentChild, h } from 'preact';
import { getTopicsListPageData, fetchTopicArticles } from '../scripts/services';
import { appRoute } from '../scripts/resolve-base-url';

import 'oj-sp/welcome-page/loader';
import 'oj-sp/image-card/loader';

interface Link {
  href: string,
  mediaType: string,
  method: string,
  rel: string
}
interface Article {
  description: string,
  fields: {
    /* eslint-disable-next-line @typescript-eslint/naming-convention, camelcase */
    article_content: string,
    author: {
      id: string,
      links: Link[]
      type: string,
      typeCategory: string
    },
    image: {
      id: string,
      links: Link[],
      type: string,
      typeCategory: string
    },
    /* eslint-disable-next-line @typescript-eslint/naming-convention, camelcase */
    image_caption: string,
    topic: {
      id: string,
      links: Link[],
      type: string,
      typeCategory: string
    },
  },
  id: string,
  links: Link[],
  name: string,
  renditionUrls: {
    height: string,
    jpgSrcset: string,
    large: string,
    medium: string,
    native: string,
    small: string,
    ojspcard: string,
    srcset: string,
    thumbnail: string,
    width: string
  },
  slug: string,
  type: string
}
interface Topic {
  articleData: {
    articles: Article[],
    topicId: string
  },
  id: string,
  name: string,
  description: string,
  renditionUrls: {
    height: string,
    jpgSrcset: string,
    large: string,
    medium: string,
    native: string,
    small: string,
    srcset: string,
    thumbnail: string,
    width: string
  }
}
interface State {
  data: {
    companyTitle: string,
    companyThumbnailRenditionUrls: {
      height: string,
      jpgSrcset: string,
      large: string,
      medium: string,
      native: string,
      small: string,
      ojspheaderimg: string,
      srcset: string,
      thumbnail: string,
      width: string
    },
    aboutUrl: string,
    contactUrl: string,
    logoID: string,
    topics: Topic[]
  },
  loading: boolean
}

/**
 * Component for the Topics List Page.
 */
class TopicsListPage extends Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      loading: false,
    };
  }

  // client side only : if this component doesn't already have its data, load it
  componentDidMount() {
    document.title = 'Topics';

    const { data } = this.state;
    if (!data) {
      this.fetchData();
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData() {
    this.setState(() => ({
      loading: true,
    }));

    getTopicsListPageData()
      .then((data) => {
        const promiseArr = [];
        for (let i = 0; i < data.topics.length; i += 1) {
          promiseArr.push(
            fetchTopicArticles(data.topics[i].id).then(
              /* eslint-disable-next-line no-param-reassign */
              (topicArticlesData) => { data.topics[i].articleData = topicArticlesData; },
            ),
          );
        }
        Promise.all(promiseArr).then(() => {
          this.setState({
            data,
            loading: false,
          });
        });
      });
  }

  // render the component
  render(): ComponentChild {
    const { loading, data } = this.state;
    if (loading === true || !data) {
      return <div className='progress-spinner' />;
    }
    const {
      companyTitle,
      companyThumbnailRenditionUrls,
      aboutUrl,
      contactUrl,
      topics,
    } = data;

    const bodyElems = [];
    let articleCards = [];
    topics.forEach(
      (topic) => {
        bodyElems.push(
          <div className='topicType'>
            <div className='topicHeading'>{topic.name}</div>
            <div>{topic.description}</div>
          </div>,
        );
        topic.articleData.articles.forEach((article) => {
          articleCards.push(
            <oj-sp-image-card
              primaryText={article.name}
              secondaryText={article.description}
              imageSrc={article.renditionUrls.native}
              footerType='none'
              onClick={ function openArticleLink() { appRoute(`/article/${article.id}`); } }
            />,
          );
        });
        bodyElems.push(
          <div className='articleItem'>
            {articleCards}
          </div>,
        );
        articleCards = [];
      },
    );

    return (
      <div>
        <oj-sp-welcome-page
          pageTitle={companyTitle}
          overlineText= 'Home'
          displayOptions={{
            imageStretch: 'full',
          }}
          illustrationForeground={companyThumbnailRenditionUrls.native}
          primaryAction={{
            label: 'About Us',
            icon: 'oj-ux-ico-information',
            display: 'on',
          }}
          onspPrimaryAction={ function openAboutLink() { window.open(aboutUrl, '_blank'); } }
          secondaryAction={{
            label: 'Contact Us',
            icon: 'oj-ux-ico-contact-edit',
            display: 'on',
          }}
          onspSecondaryAction={ function openContactLink() { window.open(contactUrl, '_blank'); } }
        >
        {bodyElems}
        </oj-sp-welcome-page>
      </div>
    );
  }
}

/*
 * Export an object with name value pairs of fetchInitialData function and component.
 */
export default TopicsListPage;

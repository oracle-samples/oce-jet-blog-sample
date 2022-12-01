/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable import/no-unresolved */

/* eslint-disable-next-line no-unused-vars */
import { Component, ComponentChild, h } from 'preact';
import filterXSS from 'xss';
import { appRoute } from '../scripts/resolve-base-url';
import { fetchArticleDetails } from '../scripts/services';
import { dateToMDY } from '../scripts/utils';

import 'oj-sp/item-overview-page/loader';
import 'oj-sp/item-overview/loader';

interface State {
  data: {
    authorRenditionUrls: {
      height: string,
      jpgSrcset: string,
      large: string,
      medium: string,
      native: string,
      small: string,
      srcset: string,
      thumbnail: string,
      width: string
    },
    content: string,
    date: {
      timezone: string,
      value: string
    },
    id: string,
    imageCaption: string,
    name: string,
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
    },
    title: string
  }
  loading: boolean
}

interface Props {
  articleId?: string,
  matches?: {
    articleId?: string
  },
  path?: string,
  url?: string
}

/**
 * Component for the Article Details Page.
 */
class ArticleDetailsPage extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      loading: true,
    };
  }

  // executed client side only
  componentDidMount() {
    document.title = 'Article';

    const { matches } = this.props;

    const { data } = this.state;
    if (!data) {
      this.fetchData(matches.articleId);
    }
  }

  // called when any of the component's properties changes
  // if the properties have changed, reload the data
  componentDidUpdate(prevProps) {
    const { matches } = this.props;

    if (prevProps.matches.articleId !== matches.articleId) {
      this.fetchData(matches.articleId);
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData(articleId) {
    this.setState(() => ({
      loading: true,
    }));

    fetchArticleDetails(articleId)
      .then((data) => this.setState(() => ({
        data,
        loading: false,
      })));
  }

  // render the component
  render(): ComponentChild {
    const {
      loading,
      data,
    } = this.state;
    if (loading === true) {
      return <div className='progress-spinner' />;
    }
    const {
      name,
      title,
      date,
      content,
      imageCaption,
    } = data;

    const formattedDate = (date && date.value) ? `${dateToMDY(date.value)}` : '';
    const options = {
      stripIgnoreTag: true, // filter out all HTML not in the whitelist
      stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
      // to filter out its content
    };
    // eslint-disable-next-line no-undef
    const cleancontent = filterXSS(content, options);

    return (
      <div>
        <oj-sp-item-overview-page
          overviewExpanded={false}
          translations={{
            goToParent: 'Back to Home',
          }}
          onspGoToParent={ function goToParent() { appRoute('/'); } }
        >
          <div slot='overview'>
            <oj-sp-item-overview
              itemTitle={title}
              itemSubtitle={formattedDate}
              photo={{
                src: data.authorRenditionUrls.small,
              }}
            />
          </div>
          <div slot='main'>
            <h1 style='text-align:center'>{name}</h1>
            <figure>
              {data.renditionUrls && (
                <picture>
                  <source type='image/webp' srcSet={data.renditionUrls.srcset} />
                  <source srcSet={data.renditionUrls.jpgSrcset} />
                  <img
                    src={data.renditionUrls.small}
                    alt='Article'
                    width={parseInt(data.renditionUrls.width, 10) * 0.66}
                    height={parseInt(data.renditionUrls.height, 10) * 0.66}
                  />
                </picture>
              )}
              <figcaption style='text-align:center'>{imageCaption}</figcaption>
            </figure>
            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
            <div dangerouslySetInnerHTML={{ __html: cleancontent }} />
          </div>
        </oj-sp-item-overview-page>
      </div>
    );
  }
}

/*
 * Export an object with name value pairs of fetchInitialData function and component.
 */
export default ArticleDetailsPage;

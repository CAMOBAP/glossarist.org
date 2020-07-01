import React from 'react'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { useRouteData } from 'react-static'
import { DocPage, DocsPageNavItem, DocsPageItem } from '../../types'
import { Backlink, Link } from 'components/Links'
import { app } from '../GlobalStyle'
import { PageTitle, Lead } from 'components/typography'
import { Asciidoc } from 'components/Asciidoc'
import * as theme from '../theme/colors'


const DESKTOP_DOCS_ROOT = '/desktop/docs/'


export default () => {
  const { docPage, docsNav }: { docPage: DocPage, docsNav: DocsPageNavItem[] } = useRouteData()
  const items = (docPage.items || []).filter(showOnPage)

  return (
    <DocsPageWrapper>

      <GlobalStyle />

      <DocsHeader><h1>Glossarist Desktop documentation</h1></DocsHeader>

      <div className="main">
        <PageTitle>{docPage.data?.title}</PageTitle>

        <div className="backlink">
          <Backlink />
        </div>

        <Lead>
          <p>
            {docPage.data?.excerpt}
          </p>
        </Lead>

        <Asciidoc className="summary" content={docPage.data?.summary || ''} />
        <Asciidoc className="contents" content={docPage.data?.contents || ''} />

        {items.length > 0
          ? <div className="items">
              {items.map(p =>
                <DocsPageItemBlock key={p.path} item={p} />
              )}
            </div>
          : null}
      </div>

      {docsNav?.length > 0
        ? <nav>
            <DocsPageNav>
              {docsNav.map(i =>
                <li key={i.path}>
                  <DocsNavLink item={i} />
                </li>
              )}
            </DocsPageNav>
          </nav>
        : null}

    </DocsPageWrapper>
  )
}


interface DocsNavLinkProps {
  item: DocsPageNavItem
  relative?: boolean
  childLevels?: number
}
const DocsNavLink: React.FC<DocsNavLinkProps> = function ({ item, relative, childLevels }) {
  return (
    <>
      {item.hasContents || item.items?.length > 0
        ? <Link
              to={item.path}
              relative={relative ? true : DESKTOP_DOCS_ROOT}>
            {item.title}
          </Link>
        : <Link
              to={`${item.path}/../#${item.id}`}
              relative={relative ? true : DESKTOP_DOCS_ROOT}>
            {item.title}
          </Link>}

      {(childLevels === undefined || childLevels > 0) && item.items?.length > 0
        ? <ul>
            {item.items.filter(showOnPage).map(p =>
              <li key={p.path}>
                <DocsNavLink
                  item={p}
                  relative={relative}
                  childLevels={childLevels !== undefined
                    ? childLevels - 1
                    : undefined} />
              </li>
            )}
          </ul>
        : null}
    </>
  )
}

interface DocsPageProps {
  item: DocsPageItem
}
const DocsPageItemBlock: React.FC<DocsPageProps> = function ({ item }) {
  return (
    <DocsPageBlock>
      {item.hasContents || item.items?.length > 0
        ? <h3><Link to={item.path}>{item.title}</Link></h3>
        : <h3>{item.title}</h3>}

      <p>{item.excerpt}</p> 
      
      {item.summary
        ? <div dangerouslySetInnerHTML={{ __html: item.summary }} />
        : null}
      
      {item.items?.length > 0
        ? <ul className="subitems">
            {item.items.filter(showOnPage).map(p =>
              <li key={p.path}>
                <DocsNavLink item={p} relative childLevels={0} />
              </li>
            )}
          </ul>
        : null}
    </DocsPageBlock>
  )
}


function showOnPage(i: DocsPageItem) {
  return i.items?.length > 0 || i.hasContents || i.excerpt || i.summary;
}


const NAV_WIDTH_REM = 18;
const HEADER_HEIGHT_REM = 8;


const GlobalStyle = createGlobalStyle`
  @media screen and (min-width: 800px) {
    ${app} {
      margin-left: 0;
      margin-right: 2rem;
    }

    ${app} > main {
      margin-left: ${NAV_WIDTH_REM + 2}rem;
      padding-top: 2rem;
    }

    ${app} > header {
      align-self: unset;
      width: ${NAV_WIDTH_REM}rem;
      overflow: hidden;
      position: fixed;

      > a {
        justify-content: center;
        height: ${HEADER_HEIGHT_REM}rem;
        padding: 0;
        margin: 0;
      }

      h1 {
        display: none;
      }
    }
  }
`


const DocsHeader = styled.header`
  @media screen and (min-width: 800px) {
    margin-top: -2rem;
    height: ${HEADER_HEIGHT_REM}rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  h1 {
    font-family: Lora;
    margin: 0;
    padding: 0;
    font-size: 100%;
    text-transform: uppercase;
    letter-spacing: .02em;
  }
`


const DocsPageWrapper = styled.div`
  > nav {
    margin-top: 2rem;
  }

  > .main {
    > .backlink {
      margin-top: -.5rem;
      margin-bottom: 1rem;
      a {
        text-decoration: none;
        font-size: 90%;
      }
    }
    > .items {
      article + article {
        margin-top: 1rem;
      }
    }
  }

  @media screen and (min-width: 800px) {
    > .main {
      max-width: 50rem;

      h2 {
        margin-top: 0;
      }

      .summary {
        margin-bottom: 1rem;
      }
    }
    > nav {
      margin-top: 0;

      width: ${NAV_WIDTH_REM}rem;
      position: fixed;
      top: ${HEADER_HEIGHT_REM}rem;
      left: 0;
      bottom: 0;
      padding-left: 2rem;

      overflow-y: auto;
      overflow-x: hidden;

      a:visited {
        opacity: .9;
      }
    }
  }
`


const DocsPageNav = styled.ul`
  font-size: 94%;

  &, ul {
    list-style: none;
    padding-left: 1rem;
  }

  li {
    margin-top: .5rem;

    a {
      text-decoration: none;
    }
  }
`


const DocsPageBlock = styled.article`
  border: ${theme.scale[0].darken(.5).desaturate(0).css()} .1rem solid;
  padding: 0 1rem;
  overflow: hidden;

  ul.subitems {
    display: flex;
    margin: 0 -1rem;
    padding: 0;
    list-style: none;

    > * + * {
      margin-left: .25rem;
    }

    > * {
      white-space: nowrap;
      padding: .25rem 1rem;
      background: ${theme.scale[0].darken(.5).desaturate(0).css()};

      > a {
        color: white;
        text-decoration: none;
      }
    }
  }
`
import React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import TreeModel from 'tree-model';
import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { routes } from '../../utils/history';
import messages from './messages';

const tree = new TreeModel();
const root = tree.parse({
  name: routes.home,
  children: [
    {
      name: routes.studyList,
      children: [
        {
          name: routes.study,
          children: [
            {
              name: routes.series,
              children: [
                {
                  name: routes.instance,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export default function Breadcrumbs() {
  const location = useLocation();
  if (!location) {
    return null;
  }

  const getMatch = node =>
    matchPath(location.pathname, {
      path: node.model.name,
      exact: false,
      strict: false,
    });

  const getBreadcrumbsHistory = node => {
    let breadcrumbsHistoryNode = node;
    const breadcrumbsHistory = [getMatch(breadcrumbsHistoryNode)];
    while (breadcrumbsHistoryNode.parent) {
      breadcrumbsHistoryNode = breadcrumbsHistoryNode.parent;
      breadcrumbsHistory.push(getMatch(breadcrumbsHistoryNode));
    }
    return breadcrumbsHistory.reverse();
  };

  const currentNode = root.first(
    node =>
      !!matchPath(location.pathname, {
        path: node.model.name,
        exact: true,
        strict: false,
      }),
  );

  const getBreadcrumbHistoryItemName = breadcrumbHistoryItem => {
    switch (breadcrumbHistoryItem.path) {
      case routes.studyList:
        return <FormattedMessage {...messages.studies} />;
      case routes.study:
        return <FormattedMessage {...messages.study} />;
      case routes.series:
        return <FormattedMessage {...messages.series} />;
      case routes.instance:
        return <FormattedMessage {...messages.instance} />;
      default:
        return '';
    }
  };

  if (!currentNode) {
    return null;
  }
  const breadcrumbsHistory = getBreadcrumbsHistory(currentNode);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      {breadcrumbsHistory.map((breadcrumbHistoryItem, index) => {
        const last = index === breadcrumbsHistory.length - 1;
        return (
          <span key={breadcrumbHistoryItem.url}>
            {last ? (
              <Typography color="textPrimary">
                {getBreadcrumbHistoryItemName(breadcrumbHistoryItem)}
              </Typography>
            ) : (
              <Link to={breadcrumbHistoryItem.url}>
                {getBreadcrumbHistoryItemName(breadcrumbHistoryItem)}
              </Link>
            )}
          </span>
        );
      })}
    </MUIBreadcrumbs>
  );
}

Breadcrumbs.propTypes = {};

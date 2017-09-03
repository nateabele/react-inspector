import React, { createElement, Component, Children } from 'react';
import PropTypes from 'prop-types';

import createStyles from '../styles/createStyles';

const Arrow = ({ expanded, styles }) => (
  <span style={{ ...styles.base, ...(expanded ? styles.expanded : styles.collapsed) }}>▶</span>
);

class TreeNode extends Component {

  render() {
    const {
      mapper,
      expanded,
      onClick,
      children,
      nodeRenderer,
      title,
      shouldShowArrow,
      shouldShowPlaceholder,
      data
    } = this.props;

    const styles = createStyles('TreeNode', this.context.theme);
    const renderedNode = createElement(nodeRenderer, this.props);
    const childNodes = expanded ? children : undefined;

    const defaultMapper = ({ Arrow, expanded, styles, onClick, shouldShowArrow, children, renderedNode, childNodes }) => (
      <div>
        <div style={styles.treeNodePreviewContainer} onClick={onClick} className="object-key">
          {shouldShowArrow || Children.count(children) > 0
            ? <Arrow expanded={expanded} styles={styles.treeNodeArrow} />
            : shouldShowPlaceholder && <span style={styles.treeNodePlaceholder}>&nbsp;</span>}
          {renderedNode}
        </div>

        <ol role="group" style={styles.treeNodeChildNodesContainer}>
          {childNodes}
        </ol>
      </div>
    );

    return (
      <li aria-expanded={expanded} role="treeitem" style={styles.treeNodeBase} title={title}>
        {(mapper || defaultMapper)({
          Arrow, expanded, styles, onClick, shouldShowArrow, children, renderedNode, childNodes, data, shouldShowPlaceholder
        })}
      </li>
    );
  }
}

TreeNode.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,

  expanded: PropTypes.bool,
  shouldShowArrow: PropTypes.bool,
  shouldShowPlaceholder: PropTypes.bool,

  nodeRenderer: PropTypes.func,

  onClick: PropTypes.func,
};

TreeNode.defaultProps = {
  name: undefined,
  data: undefined,
  mapper:  null,
  expanded: true,

  nodeRenderer: ({ name }) =>
    <span>
      {name}
    </span>,

  onClick: () => {},

  shouldShowArrow: false,
  shouldShowPlaceholder: true,
};

TreeNode.contextTypes = {
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default TreeNode;

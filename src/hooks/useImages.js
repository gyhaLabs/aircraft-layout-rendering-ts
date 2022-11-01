import ReactDOMServer from 'react-dom/server';
import { ReactComponent as Plane } from '../images/plane.svg';
import { ReactComponent as Box } from '../images//box.svg';
import { ReactComponent as BoxHovered } from '../images//box-hovered.svg';
import { ReactComponent as BoxError } from '../images//box-error.svg';
import { ReactComponent as BoxErrorHovered } from '../images//box-error-hovered.svg';
import { ReactComponent as Lavatory } from '../images/lavatory.svg';

import useImage from 'use-image';

const useImages = () => {
    const [background] = useImage(`data:image/svg+xml,${encodeURIComponent(ReactDOMServer.renderToStaticMarkup(<Plane />))}`);
    const [box] = useImage(`data:image/svg+xml,${encodeURIComponent(ReactDOMServer.renderToStaticMarkup(<Box />))}`);
    const [boxHovered] = useImage(`data:image/svg+xml,${encodeURIComponent(ReactDOMServer.renderToStaticMarkup(<BoxHovered />))}`);
    const [boxError] = useImage(`data:image/svg+xml,${encodeURIComponent(ReactDOMServer.renderToStaticMarkup(<BoxError />))}`);
    const [boxErrorHovered] = useImage(
        `data:image/svg+xml,${encodeURIComponent(ReactDOMServer.renderToStaticMarkup(<BoxErrorHovered />))}`
    );
    const [lavatory] = useImage(`data:image/svg+xml,${encodeURIComponent(ReactDOMServer.renderToStaticMarkup(<Lavatory />))}`);
    return { box, boxHovered, boxError, boxErrorHovered, background, lavatory };
};

export default useImages;

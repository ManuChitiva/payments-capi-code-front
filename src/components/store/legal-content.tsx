import type { ReactNode } from "react";

/**
 * Pieza genérica de sección legal — título + cuerpo en texto corrido,
 * con sub-listas si la sección las necesita. Reutilizada por los tres
 * modales del footer (privacidad, términos, tratamiento de datos).
 */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-[14px] font-semibold tracking-tight text-[var(--store-text)] sm:text-[15px]">
        {title}
      </h3>
      <div className="space-y-2 text-[13.5px] leading-relaxed text-[var(--store-text-soft)] sm:text-[14px]">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--store-primary)]">
      {items.map((item, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

/* -------------------------------------------------------------------------
 * Política de privacidad
 * --------------------------------------------------------------------- */
export const privacyContent = {
  title: "Política de privacidad",
  intro: (
    <p className="text-[13px] leading-relaxed text-[var(--store-text-soft)]">
      Última actualización: enero de 2026. Este documento describe cómo
      recopilamos, usamos y protegemos la información personal que nos
      compartes al usar nuestra tienda en línea.
    </p>
  ),
  body: (
    <div className="space-y-6">
      <LegalSection title="1. Responsable del tratamiento">
        <P>
          Somos Ruedas y Soluciones, una tienda especializada en neumáticos,
          llantas y accesorios para vehículos. Para cualquier asunto
          relacionado con tus datos personales, puedes escribirnos a
          hola@ruedassoluciones.co.
        </P>
      </LegalSection>

      <LegalSection title="2. Datos que recopilamos">
        <P>
          Para procesar tus pedidos y brindarte una buena experiencia,
          podemos solicitar:
        </P>
        <LegalList
          items={[
            "Nombre completo y documento de identidad.",
            "Correo electrónico y número de teléfono.",
            "Dirección de envío y, cuando aplique, datos del vehículo (marca, modelo, año) para asesoría técnica.",
            "Información de pago, procesada a través de plataformas certificadas; nunca almacenamos los datos completos de tu tarjeta.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Finalidades de uso">
        <LegalList
          items={[
            "Gestionar tu pedido, facturación y entrega.",
            "Brindar asesoría técnica sobre compatibilidad de productos.",
            "Enviarte comunicaciones sobre el estado de tu compra.",
            "Atender solicitudes, reclamos y garantías.",
            "Con tu consentimiento, enviarte novedades y promociones por correo o WhatsApp.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Legitimación">
        <P>
          Tratamos tus datos sobre la base del consentimiento que nos
          otorgas al momento de la compra, la ejecución del contrato de
          venta y el cumplimiento de obligaciones legales y tributarias.
        </P>
      </LegalSection>

      <LegalSection title="5. Conservación">
        <P>
          Mantenemos tus datos durante el tiempo necesario para cumplir
          con la finalidad para la que fueron recogidos y, posteriormente,
          durante el plazo legal aplicable a obligaciones contables y
          fiscales.
        </P>
      </LegalSection>

      <LegalSection title="6. Tus derechos">
        <P>
          Como titular de los datos, tienes derecho a conocer, actualizar,
          rectificar y suprimir tu información, así como a revocar el
          consentimiento otorgado y a presentar quejas ante la autoridad
          competente. Para ejercer estos derechos, escríbenos a
          hola@ruedassoluciones.co y responderemos en los plazos legales
          establecidos.
        </P>
      </LegalSection>

      <LegalSection title="7. Transferencias a terceros">
        <P>
          Compartimos información estrictamente necesaria con
          transportadoras, plataformas de pago certificadas y proveedores
          de servicios tecnológicos que nos ayudan a operar la tienda.
          Todos ellos cuentan con obligaciones de confidencialidad y
          protección de datos.
        </P>
      </LegalSection>

      <LegalSection title="8. Seguridad">
        <P>
          Implementamos medidas técnicas y organizativas razonables para
          proteger tu información contra acceso no autorizado, pérdida o
          alteración. Aun así, ningún sistema es 100% infalible, por lo
          que te recomendamos mantener la confidencialidad de tus
          credenciales.
        </P>
      </LegalSection>

      <LegalSection title="9. Modificaciones">
        <P>
          Podemos actualizar esta política para reflejar cambios en
          nuestras prácticas o en la normativa aplicable. Publicaremos la
          versión vigente en este mismo lugar, indicando la fecha de la
          última actualización.
        </P>
      </LegalSection>
    </div>
  ),
};

/* -------------------------------------------------------------------------
 * Términos y condiciones
 * --------------------------------------------------------------------- */
export const termsContent = {
  title: "Términos y condiciones",
  intro: (
    <p className="text-[13px] leading-relaxed text-[var(--store-text-soft)]">
      Al usar este sitio y realizar compras en él, aceptas los términos
      descritos a continuación. Te recomendamos leerlos antes de finalizar
      un pedido.
    </p>
  ),
  body: (
    <div className="space-y-6">
      <LegalSection title="1. Aceptación">
        <P>
          El uso de la tienda en línea implica la aceptación plena de
          estos términos. Si no estás de acuerdo con alguno de ellos, te
          pedimos no usar el sitio.
        </P>
      </LegalSection>

      <LegalSection title="2. Información del sitio">
        <P>
          Nos esforzamos por mantener actualizada la información del
          catálogo, incluidos precios, descripciones, referencias y
          disponibilidad. Sin embargo, pueden existir errores
          involuntarios o cambios de último momento. En caso de una
          diferencia significativa, te informaremos antes de procesar
          tu pedido.
        </P>
      </LegalSection>

      <LegalSection title="3. Proceso de compra">
        <LegalList
          items={[
            "Agrega los productos al carrito y revisa tu selección.",
            "Completa tus datos de contacto y dirección de envío.",
            "Selecciona el método de pago y confirma la compra.",
            "Recibirás un correo de confirmación con el detalle del pedido y un número de seguimiento.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Precios y pagos">
        <P>
          Todos los precios están expresados en pesos colombianos e
          incluyen los impuestos aplicables. Aceptamos pagos mediante
          plataformas certificadas (PSE, tarjetas crédito/débito y
          transferencias). Por seguridad, no almacenamos los datos
          completos de tu tarjeta.
        </P>
      </LegalSection>

      <LegalSection title="5. Despacho y entregas">
        <P>
          Realizamos envíos a todo el país. Los plazos de entrega
          dependen de la ciudad y la transportadora; los tiempos
          estimados se indican antes de confirmar la compra. En
          Bogotá y alrededores, ofrecemos también la opción de recoger
          en nuestro taller con instalación incluida.
        </P>
      </LegalSection>

      <LegalSection title="6. Garantía">
        <P>
          Todos nuestros productos son originales y cuentan con la
          garantía del fabricante. El plazo y las condiciones específicas
          dependen de la marca y se entregan con la factura de compra.
        </P>
      </LegalSection>

      <LegalSection title="7. Derecho de retracto">
        <P>
          De acuerdo con la normativa vigente, el cliente puede ejercer
          el derecho de retracto dentro de los cinco (5) días hábiles
          siguientes a la entrega del producto, siempre que este se
          encuentre en perfectas condiciones, sin uso y con su empaque
          original. Para solicitarlo, escríbenos a hola@ruedassoluciones.co.
        </P>
      </LegalSection>

      <LegalSection title="8. Instalación y servicios">
        <P>
          La instalación incluida en taller se realiza sobre vehículos
          en condiciones estándar. Cualquier adaptación o trabajo
          adicional fuera del alcance del servicio se cotiza por
          separado y se informa previamente.
        </P>
      </LegalSection>

      <LegalSection title="9. Limitación de responsabilidad">
        <P>
          No nos hacemos responsables por daños derivados del uso
          indebido de los productos, instalaciones realizadas por
          terceros, ni por retrasos atribuibles a la transportadora o a
          causas de fuerza mayor.
        </P>
      </LegalSection>

      <LegalSection title="10. Propiedad intelectual">
        <P>
          El contenido del sitio (textos, imágenes, marcas y logotipos)
          es propiedad de Ruedas y Soluciones o de sus proveedores y
          está protegido por las leyes de propiedad intelectual. Queda
          prohibida su reproducción sin autorización.
        </P>
      </LegalSection>

      <LegalSection title="11. Modificaciones">
        <P>
          Podemos actualizar estos términos en cualquier momento. La
          versión aplicable será la que esté publicada al momento de
          realizar la compra.
        </P>
      </LegalSection>

      <LegalSection title="12. Legislación aplicable">
        <P>
          Estos términos se rigen por las leyes de la República de
          Colombia. Cualquier controversia será resuelta por los
          tribunales competentes de la ciudad de Bogotá D.C.
        </P>
      </LegalSection>
    </div>
  ),
};

/* -------------------------------------------------------------------------
 * Tratamiento de datos
 * --------------------------------------------------------------------- */
export const dataTreatmentContent = {
  title: "Tratamiento de datos",
  intro: (
    <p className="text-[13px] leading-relaxed text-[var(--store-text-soft)]">
      Aquí encuentras los detalles prácticos sobre cómo tratamos tu
      información personal en cada punto de contacto con la tienda.
    </p>
  ),
  body: (
    <div className="space-y-6">
      <LegalSection title="Responsable">
        <P>
          Ruedas y Soluciones, con domicilio principal en Bogotá D.C.,
          Colombia, actúa como responsable del tratamiento de los datos
          personales que nos compartes.
        </P>
      </LegalSection>

      <LegalSection title="Finalidades específicas">
        <LegalList
          items={[
            "Procesar y entregar tus pedidos, incluyendo la coordinación con la transportadora.",
            "Verificar la compatibilidad técnica de los productos con tu vehículo.",
            "Emitir y enviar la factura electrónica de tu compra.",
            "Atender solicitudes, quejas, reclamos y garantías.",
            "Con tu consentimiento, enviarte información sobre nuevos productos, promociones y eventos.",
            "Realizar análisis internos para mejorar la experiencia en la tienda.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Categorías de datos tratados">
        <LegalList
          items={[
            "Datos de identificación: nombre, documento, correo, teléfono.",
            "Datos de ubicación: dirección de envío y, opcionalmente, de tu vehículo.",
            "Datos transaccionales: productos adquiridos, medio de pago y monto.",
            "Datos técnicos: dirección IP, tipo de navegador y comportamiento de navegación en el sitio.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Destinatarios">
        <P>
          Compartimos información estrictamente necesaria con
          transportadoras, plataformas de pago, proveedores de servicios
          tecnológicos y entidades regulators o fiscales, todos
          sometidos a obligaciones de confidencialidad.
        </P>
      </LegalSection>

      <LegalSection title="Plazo de conservación">
        <P>
          Conservamos tus datos mientras se mantenga la relación
          comercial y, posteriormente, durante el plazo legal aplicable
          para el cumplimiento de obligaciones contables, fiscales y
          de garantía.
        </P>
      </LegalSection>

      <LegalSection title="Medidas de seguridad">
        <P>
          Aplicamos controles de acceso, cifrado de la información en
          tránsito, monitoreo de eventos y buenas prácticas de manejo
          de datos para reducir el riesgo de incidentes de seguridad.
        </P>
      </LegalSection>

      <LegalSection title="Derechos del titular">
        <P>
          Puedes conocer, actualizar, rectificar y suprimir tus datos,
          así como revocar el consentimiento otorgado, solicitar
          prueba de la autorización y presentar quejas ante la
          autoridad competente. Para cualquiera de estas gestiones,
          escríbenos a hola@ruedassoluciones.co.
        </P>
      </LegalSection>
    </div>
  ),
};

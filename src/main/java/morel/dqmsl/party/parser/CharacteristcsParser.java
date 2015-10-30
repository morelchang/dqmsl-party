package morel.dqmsl.party.parser;

import java.util.Map;
import java.util.TreeMap;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class CharacteristcsParser {

	public Map<String, String> parse(Document doc) {
		TreeMap<String, String> result = new TreeMap<String, String>();
		Elements elements = doc.select("select#tks0 option");
		for (Element e : elements) {
			result.put(e.attr("value"), e.text());
		}
		return result;
	}

}
